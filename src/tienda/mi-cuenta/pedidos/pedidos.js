// Lumina · mi cuenta · pedidos
// Renderiza el resumen de cada pedido con el componente del carrito
// (componentes/carrito/resumen-compra), sin cupón ni botón de compra.

const TOTALES_PEDIDOS = {
  "pedido-resumen-1": {
    cantidad: 3,
    subtotal: 36000,
    descuento: 0,
    iva: 6480,
    total: 42480
  }
};

function renderPedidos() {
  if (typeof crearResumenCompra !== "function") {
    return;
  }

  Object.entries(TOTALES_PEDIDOS).forEach(([idContenedor, totales]) => {
    const contenedor = document.getElementById(idContenedor);

    if (!contenedor) {
      return;
    }

    contenedor.innerHTML = crearResumenCompra(totales, {
      mostrarCupon: false,
      mostrarBoton: false
    });
  });
}
