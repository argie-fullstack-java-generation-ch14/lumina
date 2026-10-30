// Lumina · carrito
// Global: carrito en localStorage. Temporal: ver Fase 2 en el README.

const carritoItems = [
  { id: 10, quantity: 1 }, // Aura
  { id: 2, quantity: 1 }, // Relajacion
  { id: 4, quantity: 1 }, // Luna Nueva
];

// Asocia cada item del carrito con los datos del catálogo
const carritoProductos = carritoItems
  .map((item) => {
    const vela = velas.find((v) => v.id === item.id);
    return vela ? { ...vela, quantity: item.quantity } : null;
  })
  .filter(Boolean);

// Renderiza los componentes del carrito en la página
function renderCarrito() {
  const contenedorItems = document.getElementById("cart-items-container");
  const contenedorResumen = document.getElementById("resumen-compra");
  const contenedorPromo = document.getElementById("card-promo");

  // Lista de artículos del carrito
  if (contenedorItems) {
    contenedorItems.innerHTML = carritoProductos
      .map(crearItemCarrito)
      .join("");
  }

  // Resumen de la compra
  if (contenedorResumen) {
    const cantidadProductos = carritoProductos.reduce(
      (acumulado, item) => acumulado + item.quantity,
      0
    );
    const subtotal = carritoProductos.reduce(
      (acumulado, item) => acumulado + item.price * item.quantity,
      0
    );

    contenedorResumen.innerHTML = crearResumenCompra(
      cantidadProductos,
      subtotal
    );
  }

  // Render card promocional
  if (contenedorPromo) {
    contenedorPromo.innerHTML = crearCardPromo();
  }
}

document.addEventListener("DOMContentLoaded", renderCarrito);
