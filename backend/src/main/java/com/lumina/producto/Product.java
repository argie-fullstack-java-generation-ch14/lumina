package com.lumina.producto;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product")
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", length = 120)
  private String name;

  @Column(name = "slug", length = 140)
  private String slug;

  @Column(name = "image_url", length = 500)
  private String imageUrl;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "product_category_id")
  private ProductCategory category;

  @Column(name = "scent", length = 120)
  private String scent;

  @Column(name = "weight_grams")
  private Integer weightGrams;

  @Column(name = "color", length = 120)
  private String color;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "price", precision = 12, scale = 2)
  private BigDecimal price;

  @Column(name = "stock")
  private Integer stock;

  @Column(name = "available")
  private Boolean available;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  // Fechas automáticas: se llenan solas al guardar o actualizar
  @PrePersist
  void beforeInsert() {
    createdAt = LocalDateTime.now();
    updatedAt = createdAt;
  }

  @PreUpdate
  void beforeUpdate() {
    updatedAt = LocalDateTime.now();
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getSlug() { return slug; }
  public void setSlug(String slug) { this.slug = slug; }

  public String getImageUrl() { return imageUrl; }
  public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

  public ProductCategory getCategory() { return category; }
  public void setCategory(ProductCategory category) { this.category = category; }

  public String getScent() { return scent; }
  public void setScent(String scent) { this.scent = scent; }

  public Integer getWeightGrams() { return weightGrams; }
  public void setWeightGrams(Integer weightGrams) { this.weightGrams = weightGrams; }

  public String getColor() { return color; }
  public void setColor(String color) { this.color = color; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public BigDecimal getPrice() { return price; }
  public void setPrice(BigDecimal price) { this.price = price; }

  public Integer getStock() { return stock; }
  public void setStock(Integer stock) { this.stock = stock; }

  public Boolean getAvailable() { return available; }
  public void setAvailable(Boolean available) { this.available = available; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public LocalDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
