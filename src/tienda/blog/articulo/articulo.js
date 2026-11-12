// Lumina · Detalle de artículo del blog
// Lee el slug de la URL (?slug=...) y renderiza el artículo correspondiente
// desde articulos.json, replicando el comportamiento del detalle de producto.

// Carpeta de este módulo: resuelve rutas correctamente.
const ARTICULO_DIR = new URL(".", import.meta.url).href;

import { formatearFecha } from "../blog.js";

function leerSlugDeLaUrl() {
  return new URLSearchParams(window.location.search).get("slug") || "";
}

async function cargarArticulos() {
  const response = await fetch(new URL("../../../data/articulos.json", ARTICULO_DIR));
  return response.json();
}

function renderizarArticulo(articulo) {
  const contenedor = document.getElementById("articulo-contenedor");
  const parrafos = (articulo.contenido || [])
    .map((texto) => `<p class="articulo-texto">${texto}</p>`)
    .join("");

  contenedor.innerHTML = `
    <header class="articulo-cabecera mb-4">
      <a class="articulo-volver" href="../index.html">
        <i class="ri-arrow-left-line"></i> Volver al blog
      </a>
      <h1 class="articulo-titulo">${articulo.titulo}</h1>
    </header>

    <figure class="articulo-imagen mb-3">
      <img src="${articulo.imagen}" alt="${articulo.alt}" class="img-fluid rounded-4">
    </figure>

    <div class="articulo-info-meta mb-4">
      <time class="articulo-meta-item d-inline-flex align-items-center gap-2" datetime="${articulo.fecha}">
        <i class="fa-solid fa-calendar-days"></i> ${formatearFecha(articulo.fecha)}
      </time>
        <span class="articulo-meta-item d-inline-flex align-items-center gap-2">
        <i class="fa-solid fa-feather-pointed"></i> ${articulo.autor}
      </span>
      <span class="articulo-chip">
        ${articulo.categoria.charAt(0).toUpperCase() + articulo.categoria.slice(1)}
      </span>
    </div>

    <div class="articulo-contenido">
      <p class="articulo-lead">${articulo.resumen}</p>
      ${parrafos}
    </div>
  `;
}

function renderizarNoEncontrado() {
  const contenedor = document.getElementById("articulo-contenedor");

  contenedor.innerHTML = `
    <div class="text-center py-5">
      <h1 class="articulo-titulo mb-3">Artículo no encontrado</h1>
      <p class="articulo-lead mb-4">
        Parece que esta vela se apagó: el artículo que buscas no existe o cambió de dirección.
      </p>
      <a class="btn btn-dark" href="../index.html">Ver todos los artículos</a>
    </div>
  `;
}

async function init() {
  const slug = leerSlugDeLaUrl();

  if (!slug) {
    renderizarNoEncontrado();
    return;
  }

  try {
    const articulos = await cargarArticulos();
    const articulo = articulos.find((a) => a.slug === slug);

    if (!articulo) {
      renderizarNoEncontrado();
      return;
    }

    document.title = `${articulo.titulo} · Blog Lumina`;
    renderizarArticulo(articulo);
  } catch (error) {
    console.error("Error al cargar el artículo:", error);
    renderizarNoEncontrado();
  }
}

init();
