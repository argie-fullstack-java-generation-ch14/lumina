const CATEGORIAS_TEMPORADA = ["navidad", "halloween"];

const SCRIPT_RECOMENDADOS = document.currentScript?.src;
const PRODUCTO_URL_RECOMENDADOS = SCRIPT_RECOMENDADOS
  ? new URL("../../tienda/catalogo/producto/", SCRIPT_RECOMENDADOS).href
  : null;

function crearCardRecomendada(producto) {
  const claseCategoria = obtenerClaseCategoria(producto.category);

  return `
        <article class="card lumina-product-card border-0 shadow-sm flex-shrink-0 product-card-fixed" data-slug="${producto.slug}">
          <div class="card-img-wrapper">
            <img src="${producto.imageUrl}" alt="Vela ${producto.name}" class="card-img-top product-card-img" loading="lazy">
          </div>
          <div class="card-body p-3">
            <div class="product-heading">
              <h2 class="product-card-title">${producto.name}</h2>
              <span class="product-category ${claseCategoria}">${producto.category}</span>
            </div>
            <div class="d-flex align-items-center justify-content-between product-specs">
              <div class="d-flex align-items-center gap-1">
                <i class="fa-solid fa-bottle-droplet" aria-hidden="true"></i>
                <span class="product-aroma small">${producto.scent}</span>
              </div>
              <span class="product-weight">${producto.weightGrams}g</span>
            </div>
            <p class="product-card-desc mb-2 small">${producto.description}</p>
            <div class="product-card-price">
              <p class="mb-0">$ ${producto.price.toLocaleString("es-CO")}</p>
              <div class="product-card-actions">
                <button
                  class="favorite-button"
                  type="button"
                  data-product-id="${producto.id}"
                  aria-pressed="${esFavorito(producto.id)}"
                  aria-label="${esFavorito(producto.id) ? `Quitar ${producto.name} de favoritos` : `Agregar ${producto.name} a favoritos`}"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  data-bs-title="${esFavorito(producto.id) ? "Quitar de favoritos" : "Agregar a favoritos"}">
                  <i class="fa-${esFavorito(producto.id) ? "solid" : "regular"} fa-heart" aria-hidden="true"></i>
                </button>
                <button class="add-to-cart" type="button" data-product-id="${producto.id}" aria-label="Agregar ${producto.name} al carrito"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  data-bs-title="Agregar al carrito">
                  <i class="fa-solid fa-cart-plus" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        </article>
  `;
}

// Template string: sección completa de recomendados (título + carrusel)
function crearSeccionRecomendados(productosRecomendados) {
  return `
        <h3 class="mb-4"
          style="font-family: var(--fuente-titulos); font-weight: 700; color: var(--cafe-lumina); font-size: 1.8rem;">
          Productos relacionados para ti
        </h3>

        <!-- Contenedor con scroll horizontal (flex-nowrap y overflow-x) -->
        <div class="d-flex flex-row flex-nowrap overflow-x-auto gap-3 px-2 pb-2 related-scroll">
            ${productosRecomendados.map(crearCardRecomendada).join("")}
        </div>
  `;
}

// 6 productos aleatorios de categorías que no son de temporada
function obtenerProductosRecomendados(cantidad = 6) {
  const candidatas = window.productos.filter(
    (producto) =>
      !CATEGORIAS_TEMPORADA.includes(
        String(producto.category ?? "").trim().toLowerCase()
      )
  );

  return [...candidatas].sort(() => Math.random() - 0.5).slice(0, cantidad);
}

// Pinta la sección en los contenedores (desktop y mobile)
function renderProductosRecomendados() {
  const seccion = crearSeccionRecomendados(obtenerProductosRecomendados());
  const contenedores = [
    document.getElementById("productos-recomendados"),
    document.getElementById("productos-recomendados-mobile"),
  ];

  contenedores.forEach((contenedor) => {
    if (!contenedor) return;

    contenedor.innerHTML = seccion;

    // Tooltip de Bootstrap para los botones de agregar al carrito.
    contenedor.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((boton) => {
      new bootstrap.Tooltip(boton);
    });
  });
}

// Agregar productos al carrito desde las cards recomendadas
document.addEventListener("click", function (evento) {
  const boton = evento.target.closest(".product-card-price .add-to-cart");

  if (!boton) {
    return;
  }

  const idProducto = boton.dataset.productId;

  if (typeof agregarAlCarrito === "function") {
    agregarAlCarrito(idProducto);
  }
});

// Navegar al detalle del producto al hacer clic en la card (sin arrastres ni botones)
const presionadosRecomendados = new WeakMap();

document.addEventListener("pointerdown", function (evento) {
  if (evento.pointerType === "mouse" && evento.button !== 0) {
    return;
  }

  const card = evento.target.closest(".product-card-fixed");

  if (card) {
    presionadosRecomendados.set(card, {
      x: evento.clientX,
      y: evento.clientY,
    });
  }
});

document.addEventListener("click", function (evento) {
  if (evento.target.closest("button, a")) {
    return;
  }

  const card = evento.target.closest(".product-card-fixed");
  const inicio = card && presionadosRecomendados.get(card);
  presionadosRecomendados.delete(card);

  if (!card || !inicio || !PRODUCTO_URL_RECOMENDADOS || !card.dataset.slug) {
    return;
  }

  const deslizo = Math.abs(inicio.x - evento.clientX) > 6 ||
    Math.abs(inicio.y - evento.clientY) > 6;

  if (deslizo) {
    return;
  }

  window.location.href = new URL(
    `?slug=${encodeURIComponent(card.dataset.slug)}`,
    PRODUCTO_URL_RECOMENDADOS
  ).href;
});

function init() {
  if (window.productos) {
    renderProductosRecomendados();
    return;
  }

  window.addEventListener("productos-listadas", renderProductosRecomendados, {
    once: true,
  });
}

document.addEventListener("DOMContentLoaded", init);
