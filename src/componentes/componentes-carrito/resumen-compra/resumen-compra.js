// Lumina · resumen-compra
// Componente: resumen de la compra (subtotal, IVA, total y cupón).
// Espera: objeto totales con { cantidad, subtotal, descuento, iva, total }
// (ver calcularTotales en js/carrito.js) y el cupón activo.

function crearResumenCompra(totales) {
  const { cantidad, subtotal, descuento, iva, total } = totales;
  const fmt = (valor) => valor.toLocaleString("es-CO");

  // Solo se muestra la fila de descuento si hay cupón aplicado.
  const filaDescuento = descuento
    ? `
      <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="summary-descuento">Cupón ${cuponAplicado} (-10 %)</span>
          <span class="summary-value">- $ ${fmt(descuento)}</span>
      </div>
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

          <div class="mb-4">
              <label for="couponInput" class="form-label coupon-label d-flex align-items-center gap-2 mb-2">
                  <i class="fa-solid fa-ticket" aria-hidden="true"></i>
                  <span>Ingresar cupón de descuento</span>
              </label>

              <div class="row g-2">
                  <div class="col-12 col-sm-8">
                      <input type="text" id="couponInput" class="form-control coupon-input"
                          value="${cuponAplicado ?? ""}"
                          placeholder="Ingresar código del cupón">
                  </div>
                  <div class="col-12 col-sm-4">
                      <button type="button" class="btn btn-apply w-100">Aplicar</button>
                  </div>
              </div>
          </div>

          <button type="button" class="btn btn-checkout w-100 py-3">
              Finalizar compra
          </button>
      </div>
  `;
}
