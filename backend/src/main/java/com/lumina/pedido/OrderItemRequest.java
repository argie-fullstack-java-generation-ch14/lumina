package com.lumina.pedido;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// Una línea del pedido: qué producto y cuántas unidades
public record OrderItemRequest(

    @NotNull(message = "El producto es obligatorio.")
    Long productId,

    @NotNull(message = "La cantidad es obligatoria.")
    @Min(value = 1, message = "La cantidad debe ser al menos 1.")
    Integer quantity) {
}
