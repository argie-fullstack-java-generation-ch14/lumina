const CATEGORIAS_TEMPORADA = ["Navidad", "Halloween"];

function crearCardRecomendada(vela) {
  const claseCategoria = obtenerClaseCategoria(vela.category);

  return `
        <article class="card lumina-product-card border-0 shadow-sm flex-shrink-0 product-card-fixed">
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
            <div class="product-card-price">$ ${vela.price.toLocaleString("es-CO")}</div>
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
    if (contenedor) contenedor.innerHTML = seccion;
  });
}

document.addEventListener("DOMContentLoaded", renderProductosRecomendados);
