package com.lumina.producto;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

  Optional<Product> findBySlug(String slug);

  boolean existsBySlug(String slug);

  List<Product> findByAvailableTrue();

  List<Product> findByCategorySlug(String slug);

  List<Product> findByCategorySlugAndAvailableTrue(String slug);

}
