package com.lumina.pedido;

import jakarta.persistence.*;
import java.math.BigDecimal;
import com.lumina.producto.Product;
import com.lumina.vela.CustomCandle;

@Entity
@Table(name = "order_item")
public class OrderItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "order_id")
  private UserOrder order;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "product_id")
  private Product product;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "custom_candle_id")
  private CustomCandle customCandle;

  @Column(name = "product_name", length = 120)
  private String productName;

  @Column(name = "unit_price", precision = 12, scale = 2)
  private BigDecimal unitPrice;

  @Column(name = "quantity")
  private Integer quantity;

  @Column(name = "line_total", precision = 12, scale = 2)
  private BigDecimal lineTotal;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public UserOrder getOrder() { return order; }
  public void setOrder(UserOrder order) { this.order = order; }

  public Product getProduct() { return product; }
  public void setProduct(Product product) { this.product = product; }

  public CustomCandle getCustomCandle() { return customCandle; }
  public void setCustomCandle(CustomCandle customCandle) { this.customCandle = customCandle; }

  public String getProductName() { return productName; }
  public void setProductName(String productName) { this.productName = productName; }

  public BigDecimal getUnitPrice() { return unitPrice; }
  public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

  public Integer getQuantity() { return quantity; }
  public void setQuantity(Integer quantity) { this.quantity = quantity; }

  public BigDecimal getLineTotal() { return lineTotal; }
  public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }
}
