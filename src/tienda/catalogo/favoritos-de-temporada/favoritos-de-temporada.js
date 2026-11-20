// Se ejecuta solo cuando el catálogo de productos está disponible.
function initFavoritosDeTemporada() {
  const productosDeTemporada = [
    ...window.productos.filter(producto => producto.categoryValue === "halloween"),
    ...window.productos.filter(producto => producto.categoryValue === "navidad")
  ];

  crearCarrusel("#favoritas-carrusel", {
    velas: productosDeTemporada
  });
}

if (window.productos) {
  initFavoritosDeTemporada();
} else {
  window.addEventListener("productos-listadas", initFavoritosDeTemporada, {
    once: true,
  });
}
