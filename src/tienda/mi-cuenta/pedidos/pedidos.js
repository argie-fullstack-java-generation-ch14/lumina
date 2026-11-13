// Lumina · mi cuenta · pedidos
// Carga los pedidos desde src/data/pedidos.json y los renderiza con el
// componente item-mis-pedidos, que reutiliza el resumen de compra del carrito.

const PEDIDOS_URL = new URL("../../../data/pedidos.json", document.currentScript.src).href;
const IVA_TASA_PEDIDOS = 0.19;

// Mismos criterios de calcularTotales en js/carrito.js (sin cupón).
// IVA_TASA_PEDIDOS evita colisionar con IVA_TASA global de carrito.js.
function calcularTotalesPedido(productos) {
  const subtotal = productos.reduce((suma, producto) => suma + producto.price, 0);
  const iva = Math.round(subtotal * IVA_TASA_PEDIDOS);

  return {
    cantidad: productos.length,
    subtotal,
    descuento: 0,
    iva,
    total: subtotal + iva
  };
}

async function renderPedidos() {
  if (typeof crearItemPedido !== "function") {
    return;
  }

  const lista = document.getElementById("accordionPedidos");

  if (!lista) {
    return;
  }

  try {
    const response = await fetch(PEDIDOS_URL);

    if (!response.ok) {
      throw new Error(`Error ${response.status} al cargar pedidos.json`);
    }

    const pedidos = await response.json();

    lista.innerHTML = pedidos
      .map((pedido, indice) => crearItemPedido({
        ...pedido,
        totales: calcularTotalesPedido(pedido.productos)
      }, indice + 1))
      .join("\n");

  } catch (error) {
    console.error("Error al renderizar los pedidos:", error);
    lista.innerHTML =
      '<div class="alert alert-danger">No se pudieron cargar tus pedidos.</div>';
  }
}
