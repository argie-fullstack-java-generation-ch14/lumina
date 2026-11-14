package com.lumina.favorito;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.lumina.usuario.AppUser;
import com.lumina.producto.Product;

@Entity
@Table(name = "favorite")
public class Favorite {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "app_user_id")
  private AppUser user;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "product_id")
  private Product product;

  private LocalDateTime createdAt;

  // Fechas automáticas: se llenan solas al guardar o actualizar
  @PrePersist
  void beforeInsert() {
    createdAt = LocalDateTime.now();
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public AppUser getUser() { return user; }
  public void setUser(AppUser user) { this.user = user; }

  public Product getProduct() { return product; }
  public void setProduct(Product product) { this.product = product; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
