package com.tradeai.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tradeai.backend.dto.LoginRequest;
import com.tradeai.backend.dto.LoginResponse;
import com.tradeai.backend.dto.RegisterRequest;
import com.tradeai.backend.entity.Importer;
import com.tradeai.backend.entity.LogisticsPartner;
import com.tradeai.backend.entity.User;
import com.tradeai.backend.repository.ImporterRepository;
import com.tradeai.backend.repository.LogisticsPartnerRepository;
import com.tradeai.backend.repository.UserRepository;
import com.tradeai.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ImporterRepository importerRepository;
    private final LogisticsPartnerRepository logisticsPartnerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = User.builder()
                .name(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole().toUpperCase())
                .languagePreference("EN")
                .build();

        User savedUser = userRepository.save(user);

        // Create profile depending on role
        if ("IMPORTER".equalsIgnoreCase(request.getRole())) {
            try {
                String catsJson = request.getPreferredCategories() != null 
                        ? objectMapper.writeValueAsString(request.getPreferredCategories()) 
                        : "[]";
                String countriesJson = request.getPreferredCountries() != null 
                        ? objectMapper.writeValueAsString(request.getPreferredCountries()) 
                        : "[]";
                Importer importer = Importer.builder()
                        .user(savedUser)
                        .licenseNumber(request.getLicenseNumber())
                        .industryType(request.getIndustryType())
                        .preferredCategories(catsJson)
                        .preferredCountries(countriesJson)
                        .build();
                importerRepository.save(importer);
            } catch (Exception e) {
                throw new RuntimeException("Failed to serialize importer lists", e);
            }
        } else if ("LOGISTICS_PARTNER".equalsIgnoreCase(request.getRole())) {
            try {
                String svcsJson = request.getServicesOffered() != null 
                        ? objectMapper.writeValueAsString(request.getServicesOffered()) 
                        : "[]";
                String regionsJson = request.getRegionsServed() != null 
                        ? objectMapper.writeValueAsString(request.getRegionsServed()) 
                        : "[]";
                LogisticsPartner partner = LogisticsPartner.builder()
                        .user(savedUser)
                        .servicesOffered(svcsJson)
                        .regionsServed(regionsJson)
                        .build();
                logisticsPartnerRepository.save(partner);
            } catch (Exception e) {
                throw new RuntimeException("Failed to serialize logistics lists", e);
            }
        }

        return savedUser;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), Collections.singletonList(user.getRole()));

        return LoginResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .languagePreference(user.getLanguagePreference())
                .build();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
