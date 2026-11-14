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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/productos")
public class ProductController {

  private final ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  // GET /api/productos
  // GET /api/productos?categoria=navidad&disponibles=true
  @GetMapping
  public List<Product> findAll(
      @RequestParam(required = false) String categoria,
      @RequestParam(defaultValue = "false") boolean disponibles) {
    return productService.findAll(categoria, disponibles);
  }

  // GET /api/productos/4
  @GetMapping("/{id}")
  public Product findById(@PathVariable Long id) {
    return productService.findById(id);
  }

  // GET /api/productos/slug/noche-de-paz
  @GetMapping("/slug/{slug}")
  public Product findBySlug(@PathVariable String slug) {
    return productService.findBySlug(slug);
  }

  // POST /api/productos
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Product create(@Valid @RequestBody ProductRequest request) {
    return productService.create(request);
  }

  // PUT /api/productos/4
  @PutMapping("/{id}")
  public Product update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
    return productService.update(id, request);
  }

  // DELETE /api/productos/4
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    productService.delete(id);
  }
}
