package com.lumina.vela;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.lumina.usuario.AppUser;

@Entity
@Table(name = "custom_candle")
public class CustomCandle {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "app_user_id")
  private AppUser user;

  @Column(name = "intention", length = 80)
  private String intention;

  @Column(name = "scent", length = 120)
  private String scent;

  @Column(name = "design_color", length = 120)
  private String designColor;

  @Column(name = "message")
  private String message;

  @Column(name = "preview_image_url", length = 500)
  private String previewImageUrl;

  @Column(name = "price", precision = 12, scale = 2)
  private BigDecimal price;

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

  public String getIntention() { return intention; }
  public void setIntention(String intention) { this.intention = intention; }

  public String getScent() { return scent; }
  public void setScent(String scent) { this.scent = scent; }

  public String getDesignColor() { return designColor; }
  public void setDesignColor(String designColor) { this.designColor = designColor; }

  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }

  public String getPreviewImageUrl() { return previewImageUrl; }
  public void setPreviewImageUrl(String previewImageUrl) { this.previewImageUrl = previewImageUrl; }

  public BigDecimal getPrice() { return price; }
  public void setPrice(BigDecimal price) { this.price = price; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
