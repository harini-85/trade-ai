package com.tradeai.backend.scheduler;

import com.tradeai.backend.entity.Country;
import com.tradeai.backend.entity.Product;
import com.tradeai.backend.repository.CountryRepository;
import com.tradeai.backend.repository.ProductRepository;
import com.tradeai.backend.service.ComplianceAggregationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ComplianceAggregationScheduler {

    private final ProductRepository productRepository;
    private final CountryRepository countryRepository;
    private final ComplianceAggregationService complianceAggregationService;

    // Monthly refresh job (approx 30 days = 2592000000 ms)
    @Scheduled(fixedRate = 2592000000L)
    public void runMonthlyComplianceSync() {
        List<Product> products = productRepository.findAll();
        List<Country> countries = countryRepository.findAll();

        for (Product product : products) {
            for (Country country : countries) {
                try {
                    // Sync with forceRefresh=false. The sync service checks if it's past 30 days
                    // and triggers live fetch only if stale.
                    complianceAggregationService.lookupAndSync(product.getId(), country.getId(), false);
                } catch (Exception e) {
                    // Log error and continue
                }
            }
        }
    }

    // Quarterly risk & demand refresh job (approx 90 days = 7776000000 ms)
    @Scheduled(fixedRate = 7776000000L)
    public void runQuarterlyRiskSync() {
        List<Product> products = productRepository.findAll();
        List<Country> countries = countryRepository.findAll();

        for (Product product : products) {
            for (Country country : countries) {
                try {
                    // Force refresh quarterly to pull World Bank and UN Comtrade indices
                    complianceAggregationService.lookupAndSync(product.getId(), country.getId(), true);
                } catch (Exception e) {
                    // Log error and continue
                }
            }
        }
    }
}
