package com.lumina.cupon;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CouponRequest(

    @NotBlank(message = "El código es obligatorio.")
    @Size(max = 40, message = "El código es muy largo.")
    String code,

    @Size(max = 255, message = "La descripción es muy larga.")
    String description,

    // PERCENTAGE = porcentaje (10 es 10 %), FIXED = valor fijo en pesos
    @NotBlank(message = "El tipo de descuento es obligatorio.")
    @Pattern(regexp = "PERCENTAGE|FIXED", message = "El tipo debe ser PERCENTAGE o FIXED.")
    String discountType,

    @NotNull(message = "El valor del descuento es obligatorio.")
    @DecimalMin(value = "0.0", inclusive = false, message = "El descuento debe ser mayor a 0.")
    BigDecimal discountValue,

    LocalDateTime validFrom,

    LocalDateTime validUntil,

    @Min(value = 1, message = "El límite de usos debe ser al menos 1.")
    Integer usageLimit,

    Boolean active) {
}
