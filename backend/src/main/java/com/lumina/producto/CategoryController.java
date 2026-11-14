package com.lumina.producto;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categorias")
public class CategoryController {

  private final CategoryService categoryService;

  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  // GET /api/categorias
  @GetMapping
  public List<ProductCategory> findAll() {
    return categoryService.findAll();
  }

  // GET /api/categorias/2
  @GetMapping("/{id}")
  public ProductCategory findById(@PathVariable Long id) {
    return categoryService.findById(id);
  }

  // POST /api/categorias
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ProductCategory create(@Valid @RequestBody CategoryRequest request) {
    return categoryService.create(request);
  }

  // PUT /api/categorias/2
  @PutMapping("/{id}")
  public ProductCategory update(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
    return categoryService.update(id, request);
  }

  // DELETE /api/categorias/2
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    categoryService.delete(id);
  }
}
