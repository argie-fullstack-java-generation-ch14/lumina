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

// Carpeta de este script: resuelve la ruta de la vista del carrito
// correctamente en todas las páginas donde se comparte
const CARRITO_URL = new URL(
  "../tienda/carrito/index.html",
  new URL(".", document.currentScript.src).href
).href;

// Decide aleatoriamente si se mostrará la card de promo o la de recicla para esta visita
const tipoCardAleatoria = Math.random() < 0.5 ? "promo" : "recicla";

// Items del carrito: `productId` referencia a productos del catálogo (js/productos.js)
// y `quantity` son las unidades agregadas
const CLAVE_CARRITO = "lumina-carrito";

function cargarCarrito() {
  try {
    const carritoGuardado = localStorage.getItem(CLAVE_CARRITO);

    if (!carritoGuardado) {
      return [];
    }

    const datos = JSON.parse(carritoGuardado);

    if (!Array.isArray(datos)) {
      return [];
    }

    return datos
      .filter(item =>
        productos.some(producto => producto.id === Number(item.productId)) &&
        Number.isInteger(Number(item.quantity)) &&
        Number(item.quantity) > 0
      )
      .map(item => ({
        productId: Number(item.productId),
        quantity: Math.min(99, Number(item.quantity))
      }));

  } catch (error) {
    console.error("Error al recuperar el carrito:", error);
    return [];
  }
}

function guardarCarrito() {
  localStorage.setItem(
    CLAVE_CARRITO,
    JSON.stringify(carrito)
  );
}

let carrito = [];

// Inicializa el carrito solo cuando el catálogo de productos está disponible.
function initCarrito() {
  carrito = cargarCarrito();
  renderCarrito();
}

if (window.productos) {
  initCarrito();
} else {
  window.addEventListener("productos-listadas", initCarrito, { once: true });
}

// Asocia cada item del carrito con los datos del catálogo (js/productos.js)
function obtenerProductosCarrito() {
  return carrito
    .map((item) => {
      const producto = productos.find((p) => p.id === item.productId);
      return producto ? { ...producto, quantity: item.quantity } : null;
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
    discountTotal: descuento,
    taxTotal: iva,
    total: subtotal - descuento + iva
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

// Notificación cuando se agrega un producto al carrito
function mostrarNotificacionCarrito(producto) {
  let notificacion = document.getElementById("cart-toast");

  if (!notificacion) {
    notificacion = document.createElement("div");
    notificacion.id = "cart-toast";
    notificacion.className = "cart-toast";
    document.body.appendChild(notificacion);
  }

  notificacion.innerHTML = `
    <div class="cart-toast-header">
      <i class="fa-solid fa-circle-check"></i>
      <strong>¡Añadido a tu carrito!</strong>
      <button type="button" class="cart-toast-close" aria-label="Cerrar">
        &times;
      </button>
    </div>

    <div class="cart-toast-content">
      <img src="${producto.imageUrl}" alt="${producto.name}">
      <div>
        <strong>${producto.name}</strong>
        <p>Tu momento especial comienza aquí.</p>
      </div>
    </div>

    <a class="cart-toast-cta" href="${CARRITO_URL}">
      Ver carrito
      <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </a>
  `;

  notificacion.classList.add("show");

  clearTimeout(notificacion.timeoutId);

  notificacion.timeoutId = setTimeout(() => {
    notificacion.classList.remove("show");
  }, 4000);

  notificacion.querySelector(".cart-toast-close").addEventListener("click", () => {
    notificacion.classList.remove("show");
  });
}

// Agregar productos al carrito
function agregarAlCarrito(id) {
  const idProducto = Number(id);

  const productoExiste = productos.some(
    producto => producto.id === idProducto
  );

  if (!productoExiste) {
    console.error("El producto no existe en el catálogo.");
    return;
  }

  const item = carrito.find(
    producto => producto.productId === idProducto
  );

  if (item) {
    item.quantity = Math.min(99, item.quantity + 1);
  } else {
    carrito.push({
      productId: idProducto,
      quantity: 1
    });
  }

  guardarCarrito();
  renderCarrito();

  const productoAgregado = productos.find(
    producto => producto.id === idProducto
  );

  mostrarNotificacionCarrito(productoAgregado);
}

// Cambios en el carrito
function cambiarCantidad(id, delta) {
  const item = carrito.find((item) => item.productId === Number(id));
  if (!item) return;

  const nuevaCantidad = item.quantity + delta;

  // Al llegar a 0 con el menos, el producto sale del carrito.
  if (nuevaCantidad < 1) {
    eliminarItem(id);
    return;
  }

  item.quantity = Math.min(99, nuevaCantidad);

  guardarCarrito();
  renderCarrito();
}

function eliminarItem(id) {
  const index = carrito.findIndex((item) => item.productId === Number(id));
  if (index === -1) return;

  carrito.splice(index, 1);

  guardarCarrito();
  renderCarrito();
}

function vaciarCarrito() {
  carrito = [];
  cuponAplicado = null;

  guardarCarrito();
  renderCarrito();
}

// Renderiza los componentes del carrito en la página
function renderCarrito() {
  const contenedorItems = document.getElementById("cart-items-container");
  const contenedorResumen = document.getElementById("resumen-compra");
  const contenedorPromo = document.getElementById("card-promo");
  const contenedorRecicla = document.getElementById("card-recicla");

  const productosCarrito = obtenerProductosCarrito();
  const totales = calcularTotales(productosCarrito);

  // Lista de artículos del carrito (o estado vacío)
  if (contenedorItems) {
    contenedorItems.innerHTML = productosCarrito.length
      ? productosCarrito.map(crearItemCarrito).join("")
      : estadoCarritoVacio();

    // Animación sutil de entrada para los items que aparecen
    if (productosCarrito.length) {
      const items = contenedorItems.querySelectorAll(".cart-item-card");
      items.forEach((item) => {
        item.classList.add("fade-in");
        setTimeout(() => item.classList.remove("fade-in"), 500);
      });
    }
  }

  // Resumen de la compra
  if (contenedorResumen) {
    contenedorResumen.innerHTML = crearResumenCompra(totales);
  }

  // Card promocional (se muestra solo si el azar eligió 'promo')
  if (contenedorPromo) {
    contenedorPromo.innerHTML = (tipoCardAleatoria === "promo") ? crearCardPromo() : "";
  }

  // Card recicla (se muestra solo si el azar eligió 'recicla')
  if (contenedorRecicla) {
    contenedorRecicla.innerHTML = (tipoCardAleatoria === "recicla") ? crearCardRecicla() : "";
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
      <p class="product-info mb-4">Encuentra tu producto ideal en el catálogo.</p>
      <a href="${catalogoUrl}" class="btn-checkout btn-catalogo">Ir al catálogo</a>
    </article>
  `;
}

// Re-pinta la burbujita del carrito con lo guardado en localStorage.
// Se necesita porque al recargar, renderCarrito del DOMContentLoaded corre
// antes de que el header (inyectado por fetch) exista en el DOM.
function refrescarBurbujaCarrito() {
  if (typeof setCartCount !== "function") return;
  if (!window.productos) return;

  const totales = calcularTotales(obtenerProductosCarrito());

  setCartCount(totales.cantidad);
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
  if (action === "delete") {
    // Desvanecer la tarjeta y eliminar del carrito al terminar la animación
    card.classList.add("fade-out");
    setTimeout(() => eliminarItem(itemId), 300);
  }
});

// Aplicar el cupón de descuento del resumen.
function marcarErrorCupon(input, mensaje) {
  const campo = input.closest(".coupon-field");
  const error = campo?.querySelector(".coupon-error");

  campo?.classList.toggle("has-error", Boolean(mensaje));
  input.setAttribute("aria-invalid", mensaje ? "true" : "false");
  if (error) {
    error.textContent = mensaje;
  }

  if (mensaje) {
    input.focus();
  }
}

document.addEventListener("click", (evento) => {
  if (!evento.target.closest(".btn-apply")) return;

  const input = document.getElementById("couponInput");
  if (!input) return;

  const codigo = input.value.trim();
  let mensaje = "";

  if (codigo === "") {
    mensaje = "Escribe el código del cupón.";
  } else if (!aplicarCupon(codigo)) {
    mensaje = "El cupón ingresado no es válido.";
  }

  if (mensaje) {
    marcarErrorCupon(input, mensaje);
    return;
  }

  marcarErrorCupon(input, "");
  renderCarrito();

  const inputDespues = document.getElementById("couponInput");
  if (inputDespues) inputDespues.value = "";
});

document.addEventListener("input", (evento) => {
  if (evento.target?.id !== "couponInput") return;
  evento.target.value = evento.target.value.toUpperCase();
  marcarErrorCupon(evento.target, "");
});

// Vaciar carrito y render al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const botonVaciar = document.querySelector(".btn-clear-cart");
  if (botonVaciar) {
    botonVaciar.dataset.action = "clear";
    botonVaciar.type = "button";
  }

  // El render inicial ahora se dispara desde initCarrito tras cargar productos.
});
