// Lumina · main
// Global: init, menú, footer.

// Base de rutas: cada página inyecta el mismo header/footer. Las páginas de
// tienda/ y admin/ están dos niveles debajo de src/, la raíz está en src/.
// Así un solo markup sirve para todas las páginas.
const base = /\/(tienda|admin)\//.test(window.location.pathname) ? '../../' : './';

// Header / Navbar — fuente única. Se inyecta en #site-header.
const headerTemplate = `
<header class="site-header">
  <div class="site-header-inner container">
    <a class="site-brand" href="${base}index.html">Lumina</a>
    <nav class="site-nav">
      <a class="site-nav-link" href="${base}tienda/inicio/index.html">Inicio</a>
      <a class="site-nav-link" href="${base}tienda/catalogo/index.html">Catálogo</a>
      <a class="site-nav-link" href="${base}tienda/nosotros/index.html">Nosotros</a>
      <a class="site-nav-link" href="${base}tienda/contacto/index.html">Contacto</a>
    </nav>
  </div>
</header>`;

// Footer — fuente única. Se inyecta en #site-footer.
const footerTemplate = `
<footer class="site-footer">
  <div class="site-footer-inner container">
    <p class="site-footer-text">Lumina · Velas personalizadas para tu bienestar.</p>
    <nav class="site-footer-nav">
      <a class="site-footer-link" href="${base}tienda/catalogo/index.html">Catálogo</a>
      <a class="site-footer-link" href="${base}tienda/nosotros/index.html">Nosotros</a>
      <a class="site-footer-link" href="${base}tienda/contacto/index.html">Contacto</a>
    </nav>
  </div>
</footer>`;

// Inject the shared header and footer into their placeholders, if present.
function renderLayout() {
  const header = document.querySelector('#site-header');
  const footer = document.querySelector('#site-footer');
  if (header) {
    header.innerHTML = headerTemplate;
  }
  if (footer) {
    footer.innerHTML = footerTemplate;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderLayout);
} else {
  renderLayout();
}
