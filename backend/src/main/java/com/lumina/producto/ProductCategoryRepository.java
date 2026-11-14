package com.lumina.producto;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {

  Optional<ProductCategory> findBySlug(String slug);

}
