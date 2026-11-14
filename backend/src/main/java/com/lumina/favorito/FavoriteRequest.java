package com.lumina.favorito;

import jakarta.validation.constraints.NotNull;

public record FavoriteRequest(

    @NotNull(message = "El usuario es obligatorio.")
    Long userId,

    @NotNull(message = "El producto es obligatorio.")
    Long productId) {
}
