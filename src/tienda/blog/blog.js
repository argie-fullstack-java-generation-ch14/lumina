import { crearBlogCard } from '../../componentes/blog-card/blog-card.js';

const BLOG_DIR = new URL(".", import.meta.url).href;

export const ARTICULO_URL = new URL("articulo/", BLOG_DIR).href;

// Convierte una fecha ISO (2025-07-02) al formato legible (02-07-2025)
export function formatearFecha(fechaISO) {
  const [anio, mes, dia] = fechaISO.split('-');
  return `${dia}-${mes}-${anio}`;
}

// Centrar la 3ª imagen de la galería en el primer render (móvil)
function centrarTerceraImagen() {
  const gallery = document.querySelector('.blog-hero-gallery');
  const container = document.querySelector('.blog-img-container');
  if (!gallery || !container) return;

  const images = container.querySelectorAll('.hero-img');
  if (images.length < 3) return;

  const target = images[2]; // 3ª imagen (índice 2)

  const centerThird = () => {
    const scrollTo = target.offsetLeft
      - (gallery.clientWidth / 2)
      + (target.offsetWidth / 2);
    gallery.scrollTo({ left: Math.max(0, scrollTo), behavior: 'smooth' });
  };

  if (target.complete) {
    centerThird();
  } else {
    target.addEventListener('load', centerThird, { once: true });
  }
}

async function renderArticulos() {
  try {
    const response = await fetch('../../data/articulos.json');
    const articulos = await response.json();
    const container = document.getElementById('articulos-container');

    articulos.forEach((articulo) => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4';
      col.innerHTML = crearBlogCard(articulo);
      container.appendChild(col);
    });
  } catch (error) {
    console.error('Error cargando artículos:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  centrarTerceraImagen();
  renderArticulos();
});
