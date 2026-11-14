package com.lumina.cupon;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupon")
public class Coupon {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "code", length = 40)
  private String code;

  @Column(name = "description")
  private String description;

  @Column(name = "discount_type", length = 30)
  private String discountType;

  @Column(name = "discount_value", precision = 12, scale = 2)
  private BigDecimal discountValue;

  @Column(name = "valid_from")
  private LocalDateTime validFrom;

  @Column(name = "valid_until")
  private LocalDateTime validUntil;

  @Column(name = "usage_limit")
  private Integer usageLimit;

  @Column(name = "usage_count")
  private Integer usageCount;

  @Column(name = "active")
  private Boolean active;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getCode() { return code; }
  public void setCode(String code) { this.code = code; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getDiscountType() { return discountType; }
  public void setDiscountType(String discountType) { this.discountType = discountType; }

  public BigDecimal getDiscountValue() { return discountValue; }
  public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

  public LocalDateTime getValidFrom() { return validFrom; }
  public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }

  public LocalDateTime getValidUntil() { return validUntil; }
  public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }

  public Integer getUsageLimit() { return usageLimit; }
  public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

  public Integer getUsageCount() { return usageCount; }
  public void setUsageCount(Integer usageCount) { this.usageCount = usageCount; }

  public Boolean getActive() { return active; }
  public void setActive(Boolean active) { this.active = active; }
}
