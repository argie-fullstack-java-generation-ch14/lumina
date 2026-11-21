// Lumina · API Adapters
// ------------------------------------------------------------
// Funciones de mapeo entre el contrato del backend y la representación del frontend.

export function mapEstadoPedido(value) {
  const map = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmado",
    PREPARING: "En preparación",
    COMPLETED: "Completado",
    CANCELLED: "Cancelado"
  };
  return { value, label: map[value] || value };
}

export function mapUsuario(usuario) {
  if (!usuario) return null;
  return {
    id: usuario.id,
    nombreCompleto: usuario.fullName,
    telefono: usuario.phone,
    email: usuario.email,
    rol: usuario.role,
    fechaRegistro: usuario.createdAt
  };
}

export function mapProducto(producto) {
  if (!producto) return null;
  return {
    id: producto.id,
    name: producto.name,
    slug: producto.slug,
    imageUrl: producto.imageUrl,
    category: producto.category,
    scent: producto.scent,
    weightGrams: producto.weightGrams,
    color: producto.color,
    description: producto.description,
    price: producto.price,
    stock: producto.stock,
    available: producto.available
  };
}

export function mapOrderResponse(order) {
  if (!order) return null;
  return {
    id: order.id,
    numeroOrden: order.orderNumber,
    fecha: order.createdAt,
    estado: mapEstadoPedido(order.status),
    subtotal: order.subtotal,
    discountTotal: order.discountTotal,
    taxTotal: order.taxTotal,
    total: order.total,
    items: (order.items || []).map((item) => ({
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.unit_price,
      quantity: item.quantity,
      lineTotal: item.line_total
    }))
  };
}
