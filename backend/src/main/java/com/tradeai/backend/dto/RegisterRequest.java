package com.tradeai.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class RegisterRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @NotBlank(message = "Role is required")
    private String role; // EXPORTER, IMPORTER, LOGISTICS_PARTNER

    // Profile Details
    private String companyName;
    private String licenseNumber;
    private String industryType;
    
    // Importer details
    private List<String> preferredCategories;
    private List<String> preferredCountries;

    // Logistics details
    private List<String> servicesOffered;
    private List<String> regionsServed;
}
