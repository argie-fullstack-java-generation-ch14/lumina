package com.lumina.producto;

import jakarta.persistence.*;

@Entity
@Table(name = "product_category")
public class ProductCategory {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", length = 80)
  private String name;

  @Column(name = "slug", length = 100)
  private String slug;

  @Column(name = "description")
  private String description;

  @Column(name = "category_type", length = 30)
  private String categoryType;

  @Column(name = "active")
  private Boolean active;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getSlug() { return slug; }
  public void setSlug(String slug) { this.slug = slug; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getCategoryType() { return categoryType; }
  public void setCategoryType(String categoryType) { this.categoryType = categoryType; }

  public Boolean getActive() { return active; }
  public void setActive(Boolean active) { this.active = active; }
}
