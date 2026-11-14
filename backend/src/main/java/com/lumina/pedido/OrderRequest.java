package com.lumina.pedido;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

// Pedido que manda el carrito. Los precios NO vienen aquí: se leen de la base de datos.
public record OrderRequest(

    @NotNull(message = "El usuario es obligatorio.")
    Long userId,

    // opcional
    String couponCode,

    @NotEmpty(message = "El pedido debe tener al menos un producto.")
    @Valid
    List<OrderItemRequest> items) {
}
