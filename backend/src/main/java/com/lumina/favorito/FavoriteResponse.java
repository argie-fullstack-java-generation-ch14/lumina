package com.lumina.favorito;

import com.lumina.producto.Product;
import java.time.LocalDateTime;

// Un favorito con los datos del producto, para pintar la tarjeta directamente
public record FavoriteResponse(Long id, Long userId, Product product, LocalDateTime createdAt) {

  public static FavoriteResponse from(Favorite favorite) {
    return new FavoriteResponse(favorite.getId(), favorite.getUser().getId(), favorite.getProduct(), favorite.getCreatedAt());
  }
}
