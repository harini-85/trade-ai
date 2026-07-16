package com.tradeai.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDto {
    private Long id;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    private String description;

    @NotBlank(message = "HS code is required")
    private String hsCode;

    @NotNull(message = "Manufacturing cost is required")
    private BigDecimal manufacturingCost;
}
