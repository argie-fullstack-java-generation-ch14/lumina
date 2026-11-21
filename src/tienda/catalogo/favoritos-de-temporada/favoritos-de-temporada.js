const CATEGORIAS_TEMPORADA = ["halloween", "navidad"];

const normalizarCategoria = (valor) =>
  String(valor ?? "").trim().toLowerCase();

// Se ejecuta solo cuando el catálogo de productos está disponible.
function initFavoritosDeTemporada() {
  const productosDeTemporada = window.productos.filter((producto) =>
    CATEGORIAS_TEMPORADA.includes(normalizarCategoria(producto.category))
  );

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
