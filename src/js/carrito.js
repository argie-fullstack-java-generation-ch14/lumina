// Lumina · carrito
// El carrito vive en memoria: la persistencia con localStorage se integrará
// en Fase 1 (ver README). Maquetación y cálculos en este archivo.

// Los componentes del carrito son template strings que viven en
// componentes/componentes-carrito/ (item-carrito.js, resumen-compra.js,
// card-promo.js).

// CARRITO (en memoria)
const IVA_TASA = 0.19;

const CUPONES = {
  LUMINA26: 0.1,
};

let cuponAplicado = null;

// Items del carrito: `id` referencia a velas del catálogo (js/velas.js)
// y `quantity` son las unidades agregadas
let carrito = [
  { id: 10, quantity: 1 }, // Aura
  { id: 2, quantity: 1 }, // Relajacion
  { id: 4, quantity: 1 }, // Luna Nueva
];

// Asocia cada item del carrito con los datos del catálogo (js/velas.js)
function obtenerProductosCarrito() {
  return carrito
    .map((item) => {
      const vela = velas.find((v) => v.id === item.id);
      return vela ? { ...vela, quantity: item.quantity } : null;
    })
    .filter(Boolean);
}

// Cálculos
function calcularTotales(productos) {
  const cantidad = productos.reduce(
    (acumulado, item) => acumulado + item.quantity,
    0
  );

  const subtotal = productos.reduce(
    (acumulado, item) => acumulado + item.price * item.quantity,
    0
  );

  // El descuento aplica sobre el subtotal y el IVA sobre la base neta
  const descuento = Math.round(subtotal * calcularDescuentoCupon());
  const iva = Math.round((subtotal - descuento) * IVA_TASA);

  return {
    cantidad,
    subtotal,
    descuento,
    iva,
    total: subtotal - descuento + iva,
  };
}

// Porcentaje de descuento del cupón activo
function calcularDescuentoCupon() {
  if (!cuponAplicado) return 0;

  return CUPONES[cuponAplicado] ?? 0;
}

// Valida el código y lo marca como cupón activo
function aplicarCupon(codigo) {
  const limpio = codigo.trim().toUpperCase();

  if (!CUPONES[limpio]) {
    return false;
  }

  cuponAplicado = limpio;
  return true;
}

// Cambios en el carrito
function cambiarCantidad(id, delta) {
  const item = carrito.find((item) => item.id === Number(id));
  if (!item) return;

  const nuevaCantidad = item.quantity + delta;

  // Al llegar a 0 con el menos, el producto sale del carrito.
  if (nuevaCantidad < 1) {
    eliminarItem(id);
    return;
  }

  item.quantity = Math.min(99, nuevaCantidad);

  renderCarrito();
}

function eliminarItem(id) {
  const index = carrito.findIndex((item) => item.id === Number(id));
  if (index === -1) return;

  carrito.splice(index, 1);

  renderCarrito();
}

function vaciarCarrito() {
  carrito = [];
  cuponAplicado = null;

  renderCarrito();
}

// Renderiza los componentes del carrito en la página
function renderCarrito() {
  const contenedorItems = document.getElementById("cart-items-container");
  const contenedorResumen = document.getElementById("resumen-compra");
  const contenedorPromo = document.getElementById("card-promo");

  const productos = obtenerProductosCarrito();
  const totales = calcularTotales(productos);

  // Lista de artículos del carrito (o estado vacío)
  if (contenedorItems) {
    contenedorItems.innerHTML = productos.length
      ? productos.map(crearItemCarrito).join("")
      : estadoCarritoVacio();
  }

  // Resumen de la compra
  if (contenedorResumen) {
    contenedorResumen.innerHTML = crearResumenCompra(totales);
  }

  // Card promocional
  if (contenedorPromo) {
    contenedorPromo.innerHTML = crearCardPromo();
  }

  // Globito del header con la cantidad del carrito (definido en js/main.js)
  if (typeof setCartCount === "function") {
    setCartCount(totales.cantidad);
  }
}

// Carrito vacío
function estadoCarritoVacio() {
  const catalogoUrl = new URL("../catalogo/index.html", location.href).href;

  return `
    <article class="card cart-empty p-5 text-center">
      <i class="fa-solid fa-cart-shopping mb-3" aria-hidden="true"></i>
      <h2 class="product-title mb-2">Carrito vacío</h2>
      <p class="product-info mb-4">Encuentra tu vela ideal en el catálogo.</p>
      <a href="${catalogoUrl}" class="btn btn-checkout px-4">Ir al catálogo</a>
    </article>
  `;
}

// Eventos de los botones para la cantidad, eliminar, vaciar carrito
document.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-action]");
  if (!boton) return;

  const { action } = boton.dataset;

  if (action === "clear") {
    vaciarCarrito();
    return;
  }

  const card = boton.closest("[data-item-id]");
  if (!card) return;
  const { itemId } = card.dataset;

  if (action === "increase") cambiarCantidad(itemId, 1);
  if (action === "decrease") cambiarCantidad(itemId, -1);
  if (action === "delete") eliminarItem(itemId);
});

// Aplicar el cupón de descuento del resumen
document.addEventListener("click", (evento) => {
  if (!evento.target.closest(".btn-apply")) return;

  const input = document.getElementById("couponInput");
  if (!input) return;

  if (!aplicarCupon(input.value)) {
    alert("El cupón ingresado no es válido.");
    return;
  }

  renderCarrito();
});

// Vaciar carrito y render al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const botonVaciar = document.querySelector(".btn-clear-cart");
  if (botonVaciar) {
    botonVaciar.dataset.action = "clear";
    botonVaciar.type = "button";
  }

  renderCarrito();
});
