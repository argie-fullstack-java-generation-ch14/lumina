package com.lumina.pedido;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_status")
public class OrderStatus {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", length = 80)
  private String name;

  @Column(name = "description")
  private String description;

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

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public LocalDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
