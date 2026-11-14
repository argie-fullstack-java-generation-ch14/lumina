// Lumina · item-carrito
// Componente: tarjeta de un artículo del carrito.
// Espera: item con la misma estructura de velas.js (id, name, img, scent,
// weight, color, price) + quantity.

// Ruta a la página de detalle del producto, resuelta desde la carpeta
// de este script (componentes/carrito/item-carrito/ → src/): sube 3 niveles.
const PRODUCTO_URL = new URL(
  "../../../tienda/catalogo/producto/",
  new URL(".", document.currentScript.src).href
).href;

function crearItemCarrito(item) {
  const urlDetalle = `${PRODUCTO_URL}?slug=${encodeURIComponent(item.slug)}`;

  return `
    <article class="card cart-item-card p-3" data-item-id="${item.id}">

      <div class="row align-items-center g-3">

          <div class="col-12 col-md-3 col-lg-2 text-center">
              <a class="product-link" href="${urlDetalle}"
                 aria-label="Ver detalles de ${item.name}">
                  <img
                      src="${item.img}"
                      alt="Vela ${item.name}"
                      class="img-fluid product-img"
                      loading="lazy"
                  >
              </a>
          </div>

          <div class="col-12 col-md-4 col-lg-4">
              <h2 class="product-title mb-2">
                  <a class="product-link" href="${urlDetalle}">${item.name}</a>
              </h2>
              <p class="product-info mb-1">
                  <strong>Aroma:</strong> ${item.scent}
              </p>
              <p class="product-info mb-1">
                  <strong>Peso:</strong> ${item.weight}g
              </p>
              <p class="product-info mb-1">
                  <strong>Color:</strong> ${item.color}
              </p>
          </div>

          <div class="col-4 col-md-2 col-lg-2">
              <div class="d-flex align-items-center justify-content-md-center gap-3 quantity-control">
                  <button
                      class="icon-btn-qty p-0"
                      type="button"
                      data-action="decrease"
                      aria-label="Disminuir cantidad">
                      <i class="fa-solid fa-minus" aria-hidden="true"></i>
                  </button>
                  <span class="fw-semibold qty-number">${item.quantity}</span>
                  <button
                      class="icon-btn-qty p-0"
                      type="button"
                      data-action="increase"
                      aria-label="Aumentar cantidad">
                      <i class="fa-solid fa-plus" aria-hidden="true"></i>
                  </button>
              </div>
          </div>

          <div class="col-6 col-md-2 col-lg-3 text-md-center">
              <span class="product-price">
                  $ ${(item.price * item.quantity).toLocaleString("es-CO")}
              </span>
          </div>

          <div class="col-2 col-md-1 col-lg-1 d-flex justify-content-center align-items-center">
              <button
                  class="icon-btn-delete p-0"
                  type="button"
                  data-action="delete"
                  aria-label="Eliminar producto">
                  <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
              </button>
          </div>

      </div>

  </article>
  `;
}
