package com.lumina.pedido;

import com.lumina.common.BadRequestException;
import com.lumina.common.ResourceNotFoundException;
import com.lumina.cupon.Coupon;
import com.lumina.cupon.CouponRepository;
import com.lumina.cupon.CouponService;
import com.lumina.producto.Product;
import com.lumina.producto.ProductRepository;
import com.lumina.usuario.UserService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

  private final UserOrderRepository orders;
  private final OrderItemRepository orderItems;
  private final OrderStatusRepository statuses;
  private final ProductRepository products;
  private final CouponRepository coupons;
  private final CouponService couponService;
  private final UserService userService;

  public OrderService(UserOrderRepository orders, OrderItemRepository orderItems, OrderStatusRepository statuses,
      ProductRepository products, CouponRepository coupons, CouponService couponService, UserService userService) {
    this.orders = orders;
    this.orderItems = orderItems;
    this.statuses = statuses;
    this.products = products;
    this.coupons = coupons;
    this.couponService = couponService;
    this.userService = userService;
  }

  // Si algo falla a la mitad (por ejemplo, no hay stock), no se guarda nada: es una sola transacción
  @Transactional
  public OrderResponse create(OrderRequest request) {
    UserOrder order = new UserOrder();
    order.setUser(userService.getUser(request.userId()));
    order.setStatus(getStatus("PENDING"));

    // 1) armo las líneas del pedido con el precio real de cada producto
    List<OrderItem> items = new ArrayList<>();
    BigDecimal subtotal = BigDecimal.ZERO;

    for (OrderItemRequest line : request.items()) {
      Product product = products.findById(line.productId())
          .orElseThrow(() -> new ResourceNotFoundException("No existe el producto " + line.productId() + "."));

      if (!Boolean.TRUE.equals(product.getAvailable())) {
        throw new BadRequestException("El producto '" + product.getName() + "' no está disponible.");
      }
      if (product.getStock() < line.quantity()) {
        throw new BadRequestException("No hay stock suficiente de '" + product.getName() + "'. Quedan " + product.getStock() + ".");
      }

      // descuento las unidades del inventario
      product.setStock(product.getStock() - line.quantity());
      products.save(product);

      BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(line.quantity()));
      subtotal = subtotal.add(lineTotal);

      OrderItem item = new OrderItem();
      item.setProduct(product);
      item.setProductName(product.getName());
      item.setUnitPrice(product.getPrice());
      item.setQuantity(line.quantity());
      item.setLineTotal(lineTotal);
      items.add(item);
    }

    // 2) cupón (opcional)
    BigDecimal discount = BigDecimal.ZERO;
    if (request.couponCode() != null && !request.couponCode().isBlank()) {
      Coupon coupon = couponService.getValidCoupon(request.couponCode());
      discount = calculateDiscount(coupon, subtotal);
      coupon.setUsageCount((coupon.getUsageCount() == null ? 0 : coupon.getUsageCount()) + 1);
      coupons.save(coupon);
      order.setCoupon(coupon);
    }

    // 3) totales (por ahora sin impuestos)
    order.setSubtotal(subtotal);
    order.setDiscountTotal(discount);
    order.setTaxTotal(BigDecimal.ZERO);
    order.setTotal(subtotal.subtract(discount));

    // 4) guardo el pedido, le pongo su número (LUM-000001) y guardo sus líneas
    order = orders.save(order);
    order.setOrderNumber(String.format("LUM-%06d", order.getId()));
    order = orders.save(order);

    for (OrderItem item : items) {
      item.setOrder(order);
    }
    orderItems.saveAll(items);

    return OrderResponse.from(order, items);
  }

  public List<OrderResponse> findAll(Long userId) {
    List<UserOrder> found = (userId == null)
        ? orders.findAllByOrderByCreatedAtDesc()
        : orders.findByUserIdOrderByCreatedAtDesc(userId);
    return found.stream().map(this::toResponse).toList();
  }

  public OrderResponse findById(Long id) {
    return toResponse(getOrder(id));
  }

  @Transactional
  public OrderResponse updateStatus(Long id, OrderStatusRequest request) {
    UserOrder order = getOrder(id);
    OrderStatus newStatus = getStatus(request.status().trim().toUpperCase());
    boolean wasCancelled = "CANCELLED".equals(order.getStatus().getName());
    boolean nowCancelled = "CANCELLED".equals(newStatus.getName());

    // si se cancela el pedido, las unidades vuelven al inventario
    if (nowCancelled && !wasCancelled) {
      for (OrderItem item : orderItems.findByOrderId(id)) {
        Product product = item.getProduct();
        if (product != null) {
          product.setStock(product.getStock() + item.getQuantity());
          products.save(product);
        }
      }
    }

    order.setStatus(newStatus);
    return toResponse(orders.save(order));
  }

  private BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
    BigDecimal discount;
    if ("PERCENTAGE".equals(coupon.getDiscountType())) {
      discount = subtotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    } else {
      discount = coupon.getDiscountValue();
    }
    // el descuento nunca puede ser mayor que el subtotal
    return discount.min(subtotal);
  }

  private OrderResponse toResponse(UserOrder order) {
    return OrderResponse.from(order, orderItems.findByOrderId(order.getId()));
  }

  private UserOrder getOrder(Long id) {
    return orders.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("No existe el pedido " + id + "."));
  }

  private OrderStatus getStatus(String name) {
    return statuses.findByName(name)
        .orElseThrow(() -> new BadRequestException("El estado '" + name + "' no existe."));
  }
}
