package com.lumina.pedido;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.lumina.usuario.AppUser;
import com.lumina.cupon.Coupon;

@Entity
@Table(name = "user_order")
public class UserOrder {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "order_number", length = 30)
  private String orderNumber;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "app_user_id")
  private AppUser user;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "order_status_id")
  private OrderStatus status;

  @Column(name = "subtotal", precision = 12, scale = 2)
  private BigDecimal subtotal;

  @Column(name = "discount_total", precision = 12, scale = 2)
  private BigDecimal discountTotal;

  @Column(name = "tax_total", precision = 12, scale = 2)
  private BigDecimal taxTotal;

  @Column(name = "total", precision = 12, scale = 2)
  private BigDecimal total;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "coupon_id")
  private Coupon coupon;

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

  public String getOrderNumber() { return orderNumber; }
  public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

  public AppUser getUser() { return user; }
  public void setUser(AppUser user) { this.user = user; }

  public OrderStatus getStatus() { return status; }
  public void setStatus(OrderStatus status) { this.status = status; }

  public BigDecimal getSubtotal() { return subtotal; }
  public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

  public BigDecimal getDiscountTotal() { return discountTotal; }
  public void setDiscountTotal(BigDecimal discountTotal) { this.discountTotal = discountTotal; }

  public BigDecimal getTaxTotal() { return taxTotal; }
  public void setTaxTotal(BigDecimal taxTotal) { this.taxTotal = taxTotal; }

  public BigDecimal getTotal() { return total; }
  public void setTotal(BigDecimal total) { this.total = total; }

  public Coupon getCoupon() { return coupon; }
  public void setCoupon(Coupon coupon) { this.coupon = coupon; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public LocalDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
