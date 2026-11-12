// Se ejecuta solo cuando el catálogo de velas está disponible.
function initFavoritosDeTemporada() {
  const velasDeTemporada = [
    ...window.velas.filter(vela => vela.category === "Halloween"),
    ...window.velas.filter(vela => vela.category === "Navidad")
  ];

  crearCarrusel("#favoritas-carrusel", {
    velas: velasDeTemporada
  });
}

if (window.velas) {
  initFavoritosDeTemporada();
} else {
  window.addEventListener("velas-listadas", initFavoritosDeTemporada, {
    once: true,
  });
}
