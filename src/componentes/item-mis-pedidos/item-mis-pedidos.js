function crearPedidoProducto(producto, opciones = {}) {
	const fmt = (valor) => valor.toLocaleString("es-CO");
	const espaciado = opciones.ultimo ? "" : " pb-3 mb-3";

	return `
	<div class="pedido-producto-item d-flex gap-3${espaciado}">
		<img
			src="${producto.img}"
			alt="Vela ${producto.name}"
			class="pedido-producto-img rounded-3"
			loading="lazy">
		<div class="pedido-producto-detalle">
			<h5 class="mb-1 fw-bold">${producto.name}</h5>
			<p class="mb-0"><strong>Aroma:</strong> ${producto.scent}</p>
			<p class="mb-0"><strong>Peso:</strong> ${producto.weight}g</p>
			<p class="mb-1"><strong>Color:</strong> ${producto.color}</p>
			<p class="mb-0 fw-bold pedido-producto-precio">$ ${fmt(producto.price)}</p>
		</div>
	</div>
	`;
}

function crearBotonPedido(pedido, indice) {
	const fmt = (valor) => valor.toLocaleString("es-CO");

	return `
	<h2 class="accordion-header" id="heading-pedido-${indice}">
		<button class="accordion-button pedido-header-btn${pedido.abierto ? "" : " collapsed"}" type="button"
			data-bs-toggle="collapse" data-bs-target="#collapse-pedido-${indice}"
			aria-expanded="${pedido.abierto ? "true" : "false"}" aria-controls="collapse-pedido-${indice}">

			<div class="pedido-header-content w-100">
				<div class="pedido-meta">
					<p class="pedido-fecha mb-2">Fecha de compra: ${pedido.fecha}</p>
					<p class="mb-1"><strong>Número de orden:</strong> <span>${pedido.numeroOrden}</span></p>
					<p class="mb-1"><strong>Total:</strong> <span>$ ${fmt(pedido.totales.total)}</span></p>
					<p class="mb-0"><strong>Total productos:</strong> <span>${pedido.productos.length}</span></p>
				</div>

				<div class="pedido-estado">
					<span class="badge rounded-pill pedido-badge-estado${pedido.estado === "PENDIENTE" ? " is-pendiente" : ""}">${pedido.estado}</span>
					<i class="ri-arrow-up-s-line pedido-chevron fs-4"></i>
				</div>
			</div>

		</button>
	</h2>
	`;
}

function crearItemPedido(pedido, indice) {
	const productos = pedido.productos
		.map((producto, i) => crearPedidoProducto(producto, {
			ultimo: i === pedido.productos.length - 1
		}))
		.join("\n");

	const resumen = typeof crearResumenCompra === "function"
		? crearResumenCompra(pedido.totales, { mostrarCupon: false, mostrarBoton: false })
		: "";

	return `
	<div class="accordion-item pedido-card mb-3">
		${crearBotonPedido(pedido, indice)}

		<div id="collapse-pedido-${indice}" class="accordion-collapse collapse${pedido.abierto ? " show" : ""}"
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
