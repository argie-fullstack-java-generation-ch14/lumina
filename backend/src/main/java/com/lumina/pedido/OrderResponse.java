package com.lumina.pedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// El pedido con sus productos, listo para mostrar
public record OrderResponse(
    Long id,
    String orderNumber,
    Long userId,
    String status,
    BigDecimal subtotal,
    BigDecimal discountTotal,
    BigDecimal taxTotal,
    BigDecimal total,
    String couponCode,
    LocalDateTime createdAt,
    List<Item> items) {

  public record Item(Long productId, String productName, BigDecimal unitPrice, Integer quantity, BigDecimal lineTotal) {
  }

  public static OrderResponse from(UserOrder order, List<OrderItem> orderItems) {
    List<Item> items = orderItems.stream()
        .map(item -> new Item(
            item.getProduct() == null ? null : item.getProduct().getId(),
            item.getProductName(),
            item.getUnitPrice(),
            item.getQuantity(),
            item.getLineTotal()))
        .toList();
    String couponCode = order.getCoupon() == null ? null : order.getCoupon().getCode();
    return new OrderResponse(
        order.getId(),
        order.getOrderNumber(),
        order.getUser().getId(),
        order.getStatus().getName(),
        order.getSubtotal(),
        order.getDiscountTotal(),
        order.getTaxTotal(),
        order.getTotal(),
        couponCode,
        order.getCreatedAt(),
        items);
  }
}
