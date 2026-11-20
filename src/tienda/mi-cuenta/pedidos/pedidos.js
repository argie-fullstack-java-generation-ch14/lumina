// Lumina · mi cuenta · pedidos
// Carga los pedidos desde src/data/pedidos.json y los que el usuario ha
// realizado (guardados en localStorage al pagar) y los renderiza con el
// componente item-mis-pedidos, que reutiliza el resumen de compra del carrito.

const PEDIDOS_URL = new URL("../../../data/pedidos.json", document.currentScript.src).href;
const PEDIDOS_GUARDADOS_KEY = "lumina-pedidos";
const IVA_TASA_PEDIDOS = 0.19;

// Cálculos de totales de un pedido (items: [{ productId, productName, unitPrice, quantity, lineTotal }]).
// IVA_TASA_PEDIDOS evita colisionar con IVA_TASA global de carrito.js.
function calcularTotalesPedido(items) {
  const subtotal = items.reduce((suma, item) => suma + item.unitPrice * item.quantity, 0);
  const descuento = 0;
  const iva = Math.round((subtotal - descuento) * IVA_TASA_PEDIDOS);

  return {
    cantidad: items.length,
    subtotal,
    discountTotal: descuento,
    taxTotal: iva,
    total: subtotal - descuento + iva
  };
}

function obtenerTotalesPedido(pedido) {
  // OrderResponse del backend trae los totales planos:
  // subtotal, discountTotal, taxTotal, total.
  if (pedido.subtotal !== undefined) {
    return {
      cantidad: pedido.items?.length ?? 0,
      subtotal: pedido.subtotal,
      discountTotal: pedido.discountTotal ?? 0,
      taxTotal: pedido.taxTotal ?? 0,
      total: pedido.total
    };
  }
  // Fallback legacy: objeto anidado pedido.totales
  if (pedido.totales) {
    return {
      cantidad: pedido.totales.cantidad ?? pedido.items?.length ?? 0,
      subtotal: pedido.totales.subtotal ?? 0,
      discountTotal: pedido.totales.discountTotal ?? 0,
      taxTotal: pedido.totales.taxTotal ?? 0,
      total: pedido.totales.total ?? 0
    };
  }
  return calcularTotalesPedido(pedido.items ?? []);
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

function renderPedidosConDatos(todos) {
  const lista = document.getElementById("accordionPedidos");
  if (!lista) {
    console.error("No se encontró #accordionPedidos en el DOM.");
    return;
  }

  if (typeof crearItemPedido !== "function") {
    console.error("crearItemPedido no está definida. Asegúrate de importar item-mis-pedidos.js antes que pedidos.js.");
    lista.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          Error de configuración: falta el componente de ítems de pedido.
        </div>
      </div>
    `;
    return;
  }

  lista.innerHTML = todos
    .map((pedido, indice) => crearItemPedido({
      ...pedido,
      totales: obtenerTotalesPedido(pedido)
    }, indice + 1))
    .join("\n");
}

// Función global que mi-cuenta.js llama tras inyectar pedidos/index.html.
window.renderPedidos = async function renderPedidos() {
  const lista = document.getElementById("accordionPedidos");
  if (!lista) {
    console.error("No se encontró #accordionPedidos en el DOM.");
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

    renderPedidosConDatos(todos);
  } catch (error) {
    console.error("Error al renderizar los pedidos:", error);
    lista.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning" role="alert">
          No se pudieron cargar los pedidos. Intenta de nuevo más tarde.
        </div>
      </div>
    `;
  }
};
