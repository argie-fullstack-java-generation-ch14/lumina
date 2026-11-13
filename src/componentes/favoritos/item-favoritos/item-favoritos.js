// Lumina · item-favoritos
// Componente: tarjeta de un artículo de favoritos.
// Espera: item con la estructura de velas.js (id, name, img, scent,
// weight, color, price). Los favoritos no manejan cantidad.

function crearItemFavorito(item) {
    return `
    <article class="card cart-item-card p-3" data-favorito-id="${item.id}">

      <div class="row align-items-center g-3">

          <div class="col-12 col-md-4 col-xl-3 text-center">
              <img
                  src="${item.img}"
                  alt="Vela ${item.name}"
                  class="img-fluid product-img"
                  loading="lazy"
              >
          </div>

          <div class="col-12 col-md-8 col-xl-5">
              <h2 class="product-title mb-2">${item.name}</h2>
              <p class="product-info mb-1">
                  <strong>Aroma:</strong> ${item.scent}
              </p>
              <p class="product-info mb-1">
                  <strong>Peso:</strong> ${item.weight}g
              </p>
              <p class="product-info mb-1">
                  <strong>Color:</strong> ${item.color}
              </p>
              <p class="product-info mb-0">
                  <strong>Precio:</strong> $ ${item.price.toLocaleString("es-CO")}
              </p>
          </div>

          <div class="col-12 col-xl-4 pe-0 d-flex justify-content-end align-items-center gap-4">
              <button
                  class="add-to-cart"
                  type="button"
                  data-product-id="${item.id}"
                  aria-label="Agregar ${item.name} al carrito">
                  Agregar al carrito
              </button>

              <button
                  class="icon-btn-delete p-0"
                  type="button"
                  data-action="delete"
                  aria-label="Quitar de favoritos">
                  <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
              </button>
          </div>

      </div>

  </article>
  `;
}
