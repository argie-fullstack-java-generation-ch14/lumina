package com.lumina.cupon;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cupones")
public class CouponController {

  private final CouponService couponService;

  public CouponController(CouponService couponService) {
    this.couponService = couponService;
  }

  // GET /api/cupones/validar?codigo=LUMINA10  (lo usa el carrito)
  @GetMapping("/validar")
  public CouponValidationResponse validate(@RequestParam String codigo) {
    return CouponValidationResponse.from(couponService.getValidCoupon(codigo));
  }

  // GET /api/cupones
  @GetMapping
  public List<Coupon> findAll() {
    return couponService.findAll();
  }

  // GET /api/cupones/1
  @GetMapping("/{id}")
  public Coupon findById(@PathVariable Long id) {
    return couponService.findById(id);
  }

  // POST /api/cupones
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Coupon create(@Valid @RequestBody CouponRequest request) {
    return couponService.create(request);
  }

  // PUT /api/cupones/1
  @PutMapping("/{id}")
  public Coupon update(@PathVariable Long id, @Valid @RequestBody CouponRequest request) {
    return couponService.update(id, request);
  }

  // DELETE /api/cupones/1
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    couponService.delete(id);
  }
}
