package com.lumina.producto;

import com.lumina.common.ConflictException;
import com.lumina.common.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

  private final ProductRepository products;
  private final CategoryService categoryService;

  public ProductService(ProductRepository products, CategoryService categoryService) {
    this.products = products;
    this.categoryService = categoryService;
  }

  // category: slug de la categoría (opcional). onlyAvailable: si es true, solo los disponibles.
  public List<Product> findAll(String category, boolean onlyAvailable) {
    boolean hasCategory = category != null && !category.isBlank();
    if (hasCategory && onlyAvailable) {
      return products.findByCategorySlugAndAvailableTrue(category);
    }
    if (hasCategory) {
      return products.findByCategorySlug(category);
    }
    if (onlyAvailable) {
      return products.findByAvailableTrue();
    }
    return products.findAll();
  }

  public Product findById(Long id) {
    return products.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("No existe el producto " + id + "."));
  }

  public Product findBySlug(String slug) {
    return products.findBySlug(slug)
        .orElseThrow(() -> new ResourceNotFoundException("No existe el producto '" + slug + "'."));
  }

  @Transactional
  public Product create(ProductRequest request) {
    String slug = buildSlug(request);
    if (products.existsBySlug(slug)) {
      throw new ConflictException("Ya existe un producto con el slug '" + slug + "'.");
    }
    Product product = new Product();
    product.setSlug(slug);
    return save(product, request);
  }

  @Transactional
  public Product update(Long id, ProductRequest request) {
    Product product = findById(id);
    String slug = buildSlug(request);
    // el slug puede repetirse solo si es el mismo producto
    products.findBySlug(slug).ifPresent(other -> {
      if (!other.getId().equals(id)) {
        throw new ConflictException("Ya existe un producto con el slug '" + slug + "'.");
      }
    });
    product.setSlug(slug);
    return save(product, request);
  }

  @Transactional
  public void delete(Long id) {
    products.delete(findById(id));
  }

  private String buildSlug(ProductRequest request) {
    String base = (request.slug() == null || request.slug().isBlank()) ? request.name() : request.slug();
    return SlugUtil.toSlug(base);
  }

  // Copia los datos del formulario al producto y lo guarda
  private Product save(Product product, ProductRequest request) {
    product.setName(request.name().trim());
    product.setImageUrl(request.imageUrl());
    product.setCategory(categoryService.findById(request.categoryId()));
    product.setScent(request.scent());
    product.setWeightGrams(request.weightGrams());
    product.setColor(request.color());
    product.setDescription(request.description());
    product.setPrice(request.price());
    product.setStock(request.stock());
    product.setAvailable(request.available() == null ? Boolean.TRUE : request.available());
    return products.save(product);
  }
}
