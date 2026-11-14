package com.lumina.carrito;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

  List<Cart> findByUserId(Long userId);

  Optional<Cart> findBySessionToken(String sessionToken);

}
