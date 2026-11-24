function obtenerDetalleProducto(productId) {
  const producto = window.productos?.find((p) => p.id === Number(productId)) || {};
  return {
    imageUrl: producto.imageUrl || "",
    scent: producto.scent || "",
    weightGrams: producto.weightGrams ?? "",
    color: producto.color || ""
  };
}

function formatearFecha(iso) {
  if (!iso) return "";
  const fecha = new Date(iso);
  return fecha.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function crearPedidoProducto(item, opciones = {}) {
  const fmt = (valor) => valor.toLocaleString("es-CO");
  const espaciado = opciones.ultimo ? "" : " pb-3 mb-3";
  const detalle = obtenerDetalleProducto(item.productId);

  const imagenHtml = detalle.imageUrl
    ? `<img src="${detalle.imageUrl}" alt="Vela ${item.productName}" class="pedido-producto-img rounded-3" loading="lazy">`
    : `<div class="pedido-producto-img rounded-3 bg-light d-flex align-items-center justify-content-center"><i class="fa-solid fa-candle text-muted"></i></div>`;

  return `
	<div class="pedido-producto-item d-flex gap-3${espaciado}">
		${imagenHtml}
		<div class="pedido-producto-detalle">
			<h5 class="mb-1 fw-bold">${item.productName}</h5>
			<p class="mb-0"><strong>Aroma:</strong> ${detalle.scent}</p>
			<p class="mb-0"><strong>Peso:</strong> ${detalle.weightGrams}g</p>
			<p class="mb-1"><strong>Color:</strong> ${detalle.color}</p>
			<p class="mb-0 fw-bold pedido-producto-precio">$ ${fmt(item.unitPrice)}</p>
		</div>
	</div>
	`;
}

function crearBotonPedido(pedido, indice) {
  const fmt = (valor) => valor.toLocaleString("es-CO");
  const isOpen = pedido.open;
  const collapseClass = isOpen ? "" : " collapsed";
  const expanded = isOpen ? "true" : "false";
  const collapseTarget = `#collapse-pedido-${indice}`;
  const headingId = `heading-pedido-${indice}`;
  const fecha = pedido.createdAt ? formatearFecha(pedido.createdAt) : pedido.fecha || "";
  const total = fmt(pedido.total ?? 0);
  const totalProductos = Array.isArray(pedido.items) ? pedido.items.length : 0;
  const estadoClase = pedido.status === "PENDING" ? " is-pendiente" : "";

  return `
	<h2 class="accordion-header" id="${headingId}">
		<button class="accordion-button pedido-header-btn${collapseClass}" type="button"
			data-bs-toggle="collapse" data-bs-target="${collapseTarget}"
			aria-expanded="${expanded}" aria-controls="${collapseTarget}">
			<div class="pedido-header-content w-100">
				<div class="pedido-meta">
					<p class="pedido-fecha mb-2">Fecha de compra: ${fecha}</p>
					<p class="mb-1"><strong>Número de orden:</strong> <span>${pedido.orderNumber}</span></p>
					<p class="mb-1"><strong>Total:</strong> <span>$ ${total}</span></p>
					<p class="mb-0"><strong>Total productos:</strong> <span>${totalProductos}</span></p>
				</div>
				<div class="pedido-estado">
					<span class="badge rounded-pill pedido-badge-estado${estadoClase}">${pedido.status}</span>
					<i class="ri-arrow-up-s-line pedido-chevron fs-4"></i>
				</div>
			</div>
		</button>
	</h2>
	`;
}

function crearItemPedido(pedido, indice) {
  const items = Array.isArray(pedido.items) ? pedido.items : [];

  const productos = items
    .map((item, i) => crearPedidoProducto(item, {
      ultimo: i === items.length - 1
    }))
    .join("\n");

  const resumen = typeof crearResumenCompra === "function"
    ? crearResumenCompra({
        cantidad: items.length,
        subtotal: pedido.subtotal,
        discountTotal: pedido.discountTotal,
        taxTotal: pedido.taxTotal,
        total: pedido.total
      }, { mostrarCupon: false, mostrarBoton: false })
    : "";

  return `
	<div class="accordion-item pedido-card mb-3">
		${crearBotonPedido(pedido, indice)}

		<div id="collapse-pedido-${indice}" class="accordion-collapse collapse${pedido.open ? " show" : ""}"
			aria-labelledby="heading-pedido-${indice}" data-bs-parent="#accordionPedidos">
			<div class="accordion-body pt-4 px-1 pb-2">
				<div class="row g-4 align-items-start">

					<div class="col-12 col-xl-7">
						<h4 class="pedido-seccion-titulo mb-3">Productos</h4>
						${productos}
					</div>

					<div class="col-12 col-xl-5">
						${resumen}
					</div>

				</div>
			</div>
		</div>
	</div>
	`;
}
