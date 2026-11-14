package com.lumina.carrito;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.lumina.producto.Product;
import com.lumina.vela.CustomCandle;

@Entity
@Table(name = "cart_item")
public class CartItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "cart_id")
  private Cart cart;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "product_id")
  private Product product;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "custom_candle_id")
  private CustomCandle customCandle;

  @Column(name = "quantity")
  private Integer quantity;

  @Column(name = "unit_price", precision = 12, scale = 2)
  private BigDecimal unitPrice;

  private LocalDateTime createdAt;

  // Fechas automáticas: se llenan solas al guardar o actualizar
  @PrePersist
  void beforeInsert() {
    createdAt = LocalDateTime.now();
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Cart getCart() { return cart; }
  public void setCart(Cart cart) { this.cart = cart; }

  public Product getProduct() { return product; }
  public void setProduct(Product product) { this.product = product; }

  public CustomCandle getCustomCandle() { return customCandle; }
  public void setCustomCandle(CustomCandle customCandle) { this.customCandle = customCandle; }

  public Integer getQuantity() { return quantity; }
  public void setQuantity(Integer quantity) { this.quantity = quantity; }

  public BigDecimal getUnitPrice() { return unitPrice; }
  public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
