import { formatearFecha } from '../../tienda/blog/blog.js';

export function crearBlogCard(articulo) {
  return `
    <article class="blog-card h-100" data-article-id="${articulo.id}">
      <div class="blog-card-header mb-2">
        <time class="blog-date d-flex align-items-center gap-2" datetime="${articulo.fecha}">
          <i class="bi bi-calendar3"></i> ${formatearFecha(articulo.fecha)}
        </time>
        <h2 class="blog-card-title h5 fw-bold">${articulo.titulo}</h2>
        <p class="blog-card-excerpt">${articulo.resumen}</p>
      </div>
      <div class="blog-card-image rounded-4 overflow-hidden">
        <img src="${articulo.imagen}" alt="${articulo.alt}" class="img-fluid w-100 h-100">
      </div>
    </article>
  `;
}
