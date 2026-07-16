package com.tradeai.backend.controller;

import com.tradeai.backend.entity.*;
import com.tradeai.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders-workflow")
@RequiredArgsConstructor
public class OrderWorkflowController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PurchaseRequestRepository purchaseRequestRepository;
    private final LogisticsQuoteRepository logisticsQuoteRepository;
    private final OrderRepository orderRepository;

    private User getAuthenticatedUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    // 1. Purchase Request Endpoints
    @GetMapping("/purchase-requests")
    public ResponseEntity<List<PurchaseRequest>> getPurchaseRequests() {
        User user = getAuthenticatedUser();
        if ("IMPORTER".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.ok(purchaseRequestRepository.findByImporterId(user.getId()));
        } else if ("EXPORTER".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.ok(purchaseRequestRepository.findByProductExporterId(user.getId()));
        }
        return ResponseEntity.ok(purchaseRequestRepository.findAll());
    }

    @PostMapping("/purchase-requests")
    public ResponseEntity<?> createPurchaseRequest(@RequestBody Map<String, Long> payload) {
        User user = getAuthenticatedUser();
        if (!"IMPORTER".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(403).body("Only importers can create purchase requests");
        }

        Long productId = payload.get("product_id");
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        PurchaseRequest request = PurchaseRequest.builder()
                .importer(user)
                .product(product)
                .status("PENDING")
                .build();

        return ResponseEntity.ok(purchaseRequestRepository.save(request));
    }

    // 2. Logistics Quotes Endpoints
    @GetMapping("/logistics-quotes")
    public ResponseEntity<List<LogisticsQuote>> getLogisticsQuotes() {
        User user = getAuthenticatedUser();
        if ("LOGISTICS_PARTNER".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.ok(logisticsQuoteRepository.findByLogisticsPartnerId(user.getId()));
        }
        return ResponseEntity.ok(logisticsQuoteRepository.findAll());
    }

    @PostMapping("/logistics-quotes")
    public ResponseEntity<?> createLogisticsQuote(@RequestBody Map<String, Object> payload) {
        User user = getAuthenticatedUser();
        if (!"LOGISTICS_PARTNER".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(403).body("Only logistics partners can submit quotes");
        }

        Long requestId = ((Number) payload.get("purchase_request_id")).longValue();
        BigDecimal price = BigDecimal.valueOf(((Number) payload.get("price")).doubleValue());
        Integer deliveryDays = ((Number) payload.get("delivery_days")).intValue();

        PurchaseRequest request = purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Purchase request not found"));

        LogisticsQuote quote = LogisticsQuote.builder()
                .purchaseRequest(request)
                .logisticsPartner(user)
                .price(price)
                .deliveryDays(deliveryDays)
                .status("PENDING")
                .build();

        LogisticsQuote savedQuote = logisticsQuoteRepository.save(quote);
        
        // Update purchase request status to QUOTED
        request.setStatus("QUOTED");
        purchaseRequestRepository.save(request);

        return ResponseEntity.ok(savedQuote);
    }

    @PostMapping("/logistics-quotes/{id}/accept")
    public ResponseEntity<?> acceptQuote(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (!"EXPORTER".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(403).body("Only exporters can accept logistics quotes");
        }

        LogisticsQuote quote = logisticsQuoteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Logistics quote not found"));

        // Accept quote
        quote.setStatus("ACCEPTED");
        logisticsQuoteRepository.save(quote);

        // Update purchase request
        PurchaseRequest request = quote.getPurchaseRequest();
        request.setStatus("ACCEPTED");
        purchaseRequestRepository.save(request);

        // Reject other quotes for the same request
        List<LogisticsQuote> otherQuotes = logisticsQuoteRepository.findByPurchaseRequestId(request.getId());
        for (LogisticsQuote oq : otherQuotes) {
            if (!oq.getId().equals(quote.getId())) {
                oq.setStatus("REJECTED");
                logisticsQuoteRepository.save(oq);
            }
        }

        // Create Order
        Order order = Order.builder()
                .purchaseRequest(request)
                .quote(quote)
                .status("ACCEPTED")
                .trackingStatus("Quote accepted. Preparing cargo shipment.")
                .build();

        return ResponseEntity.ok(orderRepository.save(order));
    }

    // 3. Orders Endpoints
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getOrders() {
        User user = getAuthenticatedUser();
        if ("IMPORTER".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.ok(orderRepository.findByPurchaseRequestImporterId(user.getId()));
        } else if ("EXPORTER".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.ok(orderRepository.findByPurchaseRequestProductExporterId(user.getId()));
        } else if ("LOGISTICS_PARTNER".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.ok(orderRepository.findByQuoteLogisticsPartnerId(user.getId()));
        }
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User user = getAuthenticatedUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        // Only exporter or logistics partner can update orders
        if (!"EXPORTER".equalsIgnoreCase(user.getRole()) && !"LOGISTICS_PARTNER".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(403).body("Unauthorized to update order status");
        }

        String status = payload.get("status"); // ACCEPTED, SHIPPED, DELIVERED, CANCELLED
        String tracking = payload.get("tracking_status");

        if (status != null) {
            order.setStatus(status.toUpperCase());
        }
        if (tracking != null) {
            order.setTrackingStatus(tracking);
        }

        return ResponseEntity.ok(orderRepository.save(order));
    }
}
