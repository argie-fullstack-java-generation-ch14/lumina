// Lumina · mi cuenta · pedidos
// Carga los pedidos desde src/data/pedidos.json y los que el usuario ha
// realizado (guardados en localStorage al pagar) y los renderiza con el
// componente item-mis-pedidos, que reutiliza el resumen de compra del carrito.

const PEDIDOS_URL = new URL("../../../data/pedidos.json", document.currentScript.src).href;
const PEDIDOS_GUARDADOS_KEY = "lumina-pedidos";
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

function obtenerPedidosGuardados() {
  try {
    const datos = JSON.parse(localStorage.getItem(PEDIDOS_GUARDADOS_KEY) || "[]");
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("Error al leer pedidos guardados:", error);
    return [];
  }
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
    const [response, pedidosGuardados] = await Promise.all([
      fetch(PEDIDOS_URL),
      Promise.resolve(obtenerPedidosGuardados())
    ]);

    if (!response.ok) {
      throw new Error(`Error ${response.status} al cargar pedidos.json`);
    }

    const pedidosJson = await response.json();

    // Los pedidos realizados por el usuario van primero (los más recientes arriba).
    const todos = [...pedidosGuardados, ...pedidosJson];

    lista.innerHTML = todos
      .map((pedido, indice) => crearItemPedido({
        ...pedido,
        totales: pedido.totales || calcularTotalesPedido(pedido.productos)
      }, indice + 1))
      .join("\n");

  } catch (error) {
    console.error("Error al renderizar los pedidos:", error);
    lista.innerHTML =
      '<div class="alert alert-danger">No se pudieron cargar tus pedidos.</div>';
  }
}
