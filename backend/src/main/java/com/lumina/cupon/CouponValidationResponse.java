package com.lumina.cupon;

import java.math.BigDecimal;

// Respuesta de "este cupón sirve": le dice al frontend cuánto descuenta
public record CouponValidationResponse(String code, String description, String discountType, BigDecimal discountValue) {

  public static CouponValidationResponse from(Coupon coupon) {
    return new CouponValidationResponse(coupon.getCode(), coupon.getDescription(), coupon.getDiscountType(), coupon.getDiscountValue());
  }
}
