package com.lumina.cupon;

import com.lumina.common.BadRequestException;
import com.lumina.common.ConflictException;
import com.lumina.common.ResourceNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CouponService {

  private final CouponRepository coupons;

  public CouponService(CouponRepository coupons) {
    this.coupons = coupons;
  }

  public List<Coupon> findAll() {
    return coupons.findAll();
  }

  public Coupon findById(Long id) {
    return coupons.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("No existe el cupón " + id + "."));
  }

  @Transactional
  public Coupon create(CouponRequest request) {
    String code = request.code().trim().toUpperCase();
    if (coupons.existsByCodeIgnoreCase(code)) {
      throw new ConflictException("Ya existe un cupón con ese código.");
    }
    Coupon coupon = new Coupon();
    coupon.setUsageCount(0);
    return save(coupon, request, code);
  }

  @Transactional
  public Coupon update(Long id, CouponRequest request) {
    Coupon coupon = findById(id);
    String code = request.code().trim().toUpperCase();
    coupons.findByCodeIgnoreCase(code).ifPresent(other -> {
      if (!other.getId().equals(id)) {
        throw new ConflictException("Ya existe un cupón con ese código.");
      }
    });
    return save(coupon, request, code);
  }

  @Transactional
  public void delete(Long id) {
    coupons.delete(findById(id));
  }

  // Devuelve el cupón si se puede usar ahora mismo. Si no, explica por qué.
  public Coupon getValidCoupon(String code) {
    Coupon coupon = coupons.findByCodeIgnoreCase(code.trim())
        .orElseThrow(() -> new BadRequestException("El cupón no existe."));

    LocalDateTime now = LocalDateTime.now();
    if (!Boolean.TRUE.equals(coupon.getActive())) {
      throw new BadRequestException("El cupón no está activo.");
    }
    if (coupon.getValidFrom() != null && now.isBefore(coupon.getValidFrom())) {
      throw new BadRequestException("El cupón todavía no está disponible.");
    }
    if (coupon.getValidUntil() != null && now.isAfter(coupon.getValidUntil())) {
      throw new BadRequestException("El cupón ya venció.");
    }
    boolean limitReached = coupon.getUsageLimit() != null && coupon.getUsageCount() != null
        && coupon.getUsageCount() >= coupon.getUsageLimit();
    if (limitReached) {
      throw new BadRequestException("El cupón ya llegó a su límite de usos.");
    }
    return coupon;
  }

  private Coupon save(Coupon coupon, CouponRequest request, String code) {
    coupon.setCode(code);
    coupon.setDescription(request.description());
    coupon.setDiscountType(request.discountType());
    coupon.setDiscountValue(request.discountValue());
    coupon.setValidFrom(request.validFrom());
    coupon.setValidUntil(request.validUntil());
    coupon.setUsageLimit(request.usageLimit());
    coupon.setActive(request.active() == null ? Boolean.TRUE : request.active());
    return coupons.save(coupon);
  }
}
