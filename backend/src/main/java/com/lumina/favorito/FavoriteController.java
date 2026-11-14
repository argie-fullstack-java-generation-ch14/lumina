package com.lumina.favorito;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class FavoriteController {

  private final FavoriteService favoriteService;

  public FavoriteController(FavoriteService favoriteService) {
    this.favoriteService = favoriteService;
  }

  // GET /api/usuarios/2/favoritos
  @GetMapping("/usuarios/{userId}/favoritos")
  public List<FavoriteResponse> findByUser(@PathVariable Long userId) {
    return favoriteService.findByUser(userId);
  }

  // POST /api/favoritos   { "userId": 2, "productId": 4 }
  @PostMapping("/favoritos")
  @ResponseStatus(HttpStatus.CREATED)
  public FavoriteResponse add(@Valid @RequestBody FavoriteRequest request) {
    return favoriteService.add(request);
  }

  // DELETE /api/favoritos/7
  @DeleteMapping("/favoritos/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void remove(@PathVariable Long id) {
    favoriteService.remove(id);
  }
}
