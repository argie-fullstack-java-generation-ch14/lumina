// Lumina · resumen-compra
// Componente: resumen de la compra (subtotal, IVA, total y cupón).
// Espera: objeto totales con { cantidad, subtotal, descuento, iva, total }
// (ver calcularTotales en js/carrito.js) y el cupón activo.

const CATALOGO_URL = new URL("../catalogo/index.html", location.href).href;

function crearResumenCompra(totales, opciones = {}) {
	const { cantidad, subtotal, descuento, iva, total } = totales;
	const { mostrarCupon = true, mostrarBoton = true } = opciones;
	const fmt = (valor) => valor.toLocaleString("es-CO");

	// Solo se muestra la fila de descuento si hay cupón aplicado
	const filaDescuento = descuento && mostrarCupon
		? `
      <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="summary-descuento">Cupón ${cuponAplicado} (-10 %)</span>
          <span class="summary-value">- $ ${fmt(descuento)}</span>
      </div>
      `
		: "";

	const bloqueCupon = mostrarCupon
		? `
          <div class="mb-4 coupon-field">
              <label for="couponInput" class="form-label coupon-label d-flex align-items-center gap-2 mb-2">
                  <i class="fa-solid fa-ticket" aria-hidden="true"></i>
                  <span>Ingresar cupón de descuento</span>
              </label>

                <div class="row g-2">
                    <div class="col-12 col-sm-8 col-lg-12 col-xl-8">
                        <input type="text" id="couponInput" class="form-control coupon-input"
                            value="${cuponAplicado ?? ""}"
                            aria-describedby="couponError"
                            placeholder="Ingresar código del cupón">
                    </div>
                    <div class="col-12 col-sm-4 col-lg-12 col-xl-4">
                        <button type="button" class="btn-apply w-100">Aplicar</button>
                    </div>
                </div>

                <p class="coupon-error" id="couponError" aria-live="polite"></p>
          </div>

          <button type="button" class="btn-checkout w-100 mb-2"${cantidad > 0 ? "" : " disabled"}>
              Finalizar compra
          </button>

          <a href="${CATALOGO_URL}" class="btn-seguir-comprando w-100" type="button">
              Seguir comprando
          </a>
      `
		: "";

	return `
      <div class="card summary-card p-4 mb-4">
          <h2 class="summary-title mb-4">Resumen de la compra</h2>

          <!-- Subtotal con Flexbox seguro -->
          <div class="summary-row">
              <span class="summary-text-muted">Subtotal (${cantidad} productos)</span>
              <span class="summary-value">$ ${fmt(subtotal)}</span>
          </div>

          ${filaDescuento}

          <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="summary-text-muted">IVA</span>
              <span class="summary-value">$ ${fmt(iva)}</span>
          </div>

          <hr class="summary-divider my-3">

          <div class="d-flex justify-content-between align-items-center mb-4">
              <span class="summary-total-label">Total</span>
              <span class="summary-total-value">$ ${fmt(total)}</span>
          </div>

          <hr class="summary-divider mt-0 mb-4">

          ${bloqueCupon}
      </div>
  `;
}
