package com.lumina.producto;

import com.lumina.common.ConflictException;
import com.lumina.common.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {

  private final ProductCategoryRepository categories;

  public CategoryService(ProductCategoryRepository categories) {
    this.categories = categories;
  }

  public List<ProductCategory> findAll() {
    return categories.findAll();
  }

  public ProductCategory findById(Long id) {
    return categories.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("No existe la categoría " + id + "."));
  }

  @Transactional
  public ProductCategory create(CategoryRequest request) {
    String slug = SlugUtil.toSlug(request.name());
    if (categories.findBySlug(slug).isPresent()) {
      throw new ConflictException("Ya existe una categoría con ese nombre.");
    }
    ProductCategory category = new ProductCategory();
    category.setSlug(slug);
    return save(category, request);
  }

  @Transactional
  public ProductCategory update(Long id, CategoryRequest request) {
    ProductCategory category = findById(id);
    String slug = SlugUtil.toSlug(request.name());
    // el slug puede repetirse solo si es la misma categoría
    categories.findBySlug(slug).ifPresent(other -> {
      if (!other.getId().equals(id)) {
        throw new ConflictException("Ya existe una categoría con ese nombre.");
      }
    });
    category.setSlug(slug);
    return save(category, request);
  }

  @Transactional
  public void delete(Long id) {
    categories.delete(findById(id));
  }

  private ProductCategory save(ProductCategory category, CategoryRequest request) {
    category.setName(request.name().trim());
    category.setDescription(request.description());
    category.setCategoryType(request.categoryType());
    category.setActive(request.active() == null ? Boolean.TRUE : request.active());
    return categories.save(category);
  }
}
