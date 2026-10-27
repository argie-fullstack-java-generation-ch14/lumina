// Lumina · main
// Global: header y footer compartidos y, en la home, inyección del contenido
// de cada página dentro de su sección.

document.addEventListener("DOMContentLoaded", async () => {
  await renderPartial("#header", "header/header.html");
  await renderPartial("#footer", "footer/footer.html");

  // Las secciones solo aplican en el index raíz; en los módulos el id
  // coincidiría y se re-inyectaría.
  if (document.body.dataset.page !== "home") return;

  const routes = {
    "#inicio": "tienda/inicio/index.html",
    "#favs-de-temporada": "tienda/catalogo/favoritos-de-temporada/favoritos-de-temporada.html",
    "#catalogo": "tienda/catalogo/index.html",
    "#nosotros": "tienda/nosotros/index.html",
    "#contacto": "tienda/contacto/index.html",
  };

  Object.entries(routes).forEach(([selector, path]) => {
    renderSection(selector, path);
  });
});
