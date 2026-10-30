// Lumina · main
// Global: header y footer compartidos y, en la home, inyección del contenido
// de cada página dentro de su sección.

document.addEventListener("DOMContentLoaded", async () => {
  await renderPartial("#header", "header/header.html");
  initHeader();
  await renderPartial("#footer", "footer/footer.html");

  // Las secciones solo aplican en el index raíz; en los módulos el id
  // coincidiría y se re-inyectaría.
  if (document.body.dataset.page !== "home") return;

  renderHomeSections();
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted && document.body.dataset.page === "home") {
    renderHomeSections();
  }
});

const routes = {
  "#inicio": "tienda/inicio/index.html",
  "#favs-de-temporada": "tienda/catalogo/favoritos-de-temporada/favoritos-de-temporada.html",
  "#catalogo": "tienda/catalogo/index.html",
  "#nosotros": "tienda/nosotros/index.html",
  "#contacto": "tienda/contacto/index.html",
};

function renderHomeSections() {
  Object.entries(routes).forEach(([selector, path]) => {
    renderSection(selector, path, { forceScripts: true });
  });
}

/* ==========================================================
 * HEADER
 *  - Marca el enlace de la página donde estás (el puntito del menú).
 *  - setCartCount(3) muestra un 3 en el carrito; setCartCount(0) lo oculta.
 * ========================================================== */
function initHeader() {
  document.querySelectorAll(".site-nav-link[data-page]").forEach((link) => {
    if (location.pathname.includes(`/tienda/${link.dataset.page}/`)) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function setCartCount(total) {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  badge.textContent = total;
  badge.hidden = !total;
}
