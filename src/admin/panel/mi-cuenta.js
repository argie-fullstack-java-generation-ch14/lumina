// Lumina · admin/panel · Orquestador de pestañas
// ------------------------------------------------------------
// Inicializa los módulos de cada pestaña (el HTML ya está embebido en index.html).

// Cargar información de la cuenta
if (typeof cargarInformacionCuenta === "function") {
  cargarInformacionCuenta();
}

// Cargar pedidos
if (typeof renderPedidos === "function") {
  renderPedidos();
}

// Cargar favoritos
if (typeof renderFavoritos === "function") {
  renderFavoritos();
}

// Actualizar burbuja del carrito
function actualizarBurbujaCarrito() {
  if (typeof refrescarBurbujaCarrito === "function") {
    refrescarBurbujaCarrito();
  }
}

if (document.getElementById("cart-count")) {
  actualizarBurbujaCarrito();
} else {
  const observer = new MutationObserver(() => {
    const badge = document.getElementById("cart-count");
    if (badge) {
      observer.disconnect();
      actualizarBurbujaCarrito();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
