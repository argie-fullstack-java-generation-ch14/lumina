const CATEGORIAS_TEMPORADA = ["Navidad", "Halloween"];

const SCRIPT_RECOMENDADOS = document.currentScript?.src;
const PRODUCTO_URL_RECOMENDADOS = SCRIPT_RECOMENDADOS
  ? new URL("../../tienda/catalogo/producto/", SCRIPT_RECOMENDADOS).href
  : null;

function crearCardRecomendada(vela) {
  const claseCategoria = obtenerClaseCategoria(vela.category);

  return `
        <article class="card lumina-product-card border-0 shadow-sm flex-shrink-0 product-card-fixed" data-slug="${vela.slug}">
          <div class="card-img-wrapper">
            <img src="${vela.img}" alt="Vela ${vela.name}" class="card-img-top product-card-img" loading="lazy">
          </div>
          <div class="card-body p-3">
            <div class="product-heading">
              <h2 class="product-card-title">${vela.name}</h2>
              <span class="product-category ${claseCategoria}">${vela.category}</span>
            </div>
            <div class="d-flex align-items-center justify-content-between product-specs">
              <div class="d-flex align-items-center gap-1">
                <i class="fa-solid fa-bottle-droplet" aria-hidden="true"></i>
                <span class="product-aroma small">${vela.scent}</span>
              </div>
              <span class="product-weight">${vela.weight}g</span>
            </div>
            <p class="product-card-desc mb-2 small">${vela.description}</p>
            <div class="product-card-price">
              <p class="mb-0">$ ${vela.price.toLocaleString("es-CO")}</p>
              <div class="product-card-actions">
                <button
                  class="favorite-button"
                  type="button"
                  data-product-id="${vela.id}"
                  aria-pressed="${esFavorito(vela.id)}"
                  aria-label="${esFavorito(vela.id) ? `Quitar ${vela.name} de favoritos` : `Agregar ${vela.name} a favoritos`}"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  data-bs-title="${esFavorito(vela.id) ? "Quitar de favoritos" : "Agregar a favoritos"}">
                  <i class="fa-${esFavorito(vela.id) ? "solid" : "regular"} fa-heart" aria-hidden="true"></i>
                </button>
                <button class="add-to-cart" type="button" data-product-id="${vela.id}" aria-label="Agregar ${vela.name} al carrito"
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
function crearSeccionRecomendados(velasRecomendadas) {
  return `
        <h3 class="mb-4"
          style="font-family: var(--fuente-titulos); font-weight: 700; color: var(--cafe-lumina); font-size: 1.8rem;">
          Productos relacionados para ti
        </h3>

        <!-- Contenedor con scroll horizontal (flex-nowrap y overflow-x) -->
        <div class="d-flex flex-row flex-nowrap overflow-x-auto gap-3 px-2 pb-2 related-scroll">
            ${velasRecomendadas.map(crearCardRecomendada).join("")}
        </div>
  `;
}

// 6 velas aleatorias de categorías que no son de temporada
function obtenerVelasRecomendadas(cantidad = 6) {
  const candidatas = velas.filter(
    (vela) => !CATEGORIAS_TEMPORADA.includes(vela.category)
  );

  return [...candidatas].sort(() => Math.random() - 0.5).slice(0, cantidad);
}

// Pinta la sección en los contenedores (desktop y mobile)
function renderProductosRecomendados() {
  const seccion = crearSeccionRecomendados(obtenerVelasRecomendadas());
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

// Navegar al detalle de la vela al hacer clic en la card (sin arrastres ni botones)
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
  if (window.velas) {
    renderProductosRecomendados();
    return;
  }

  window.addEventListener("velas-listadas", renderProductosRecomendados, {
    once: true,
  });
}

document.addEventListener("DOMContentLoaded", init);
