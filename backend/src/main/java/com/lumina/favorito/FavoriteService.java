package com.lumina.favorito;

import com.lumina.common.ConflictException;
import com.lumina.common.ResourceNotFoundException;
import com.lumina.producto.ProductService;
import com.lumina.usuario.UserService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {

  private final FavoriteRepository favorites;
  private final UserService userService;
  private final ProductService productService;

  public FavoriteService(FavoriteRepository favorites, UserService userService, ProductService productService) {
    this.favorites = favorites;
    this.userService = userService;
    this.productService = productService;
  }

  public List<FavoriteResponse> findByUser(Long userId) {
    userService.getUser(userId); // si el usuario no existe, responde 404
    return favorites.findByUserId(userId).stream().map(FavoriteResponse::from).toList();
  }

  @Transactional
  public FavoriteResponse add(FavoriteRequest request) {
    if (favorites.existsByUserIdAndProductId(request.userId(), request.productId())) {
      throw new ConflictException("Este producto ya está en tus favoritos.");
    }
    Favorite favorite = new Favorite();
    favorite.setUser(userService.getUser(request.userId()));
    favorite.setProduct(productService.findById(request.productId()));
    return FavoriteResponse.from(favorites.save(favorite));
  }

  @Transactional
  public void remove(Long id) {
    Favorite favorite = favorites.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("No existe el favorito " + id + "."));
    favorites.delete(favorite);
  }
}
