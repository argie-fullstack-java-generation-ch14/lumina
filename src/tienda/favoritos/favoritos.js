function renderFavoritos() {
  const contenedorItems = document.getElementById("favoritos-items-container");

  const productos = obtenerProductosFavoritos();

  // Lista de artículos de favoritos (o estado vacío)
  if (contenedorItems) {
    contenedorItems.innerHTML = productos.length
      ? productos.map(crearItemFavorito).join("")
      : estadoFavoritosVacio();
  }
}

// Favoritos vacío
function estadoFavoritosVacio() {
  const catalogoUrl = new URL("../catalogo/index.html", location.href).href;

  return `
    <article class="card cart-empty p-5 text-center">
      <i class="fa-solid fa-heart mb-3" aria-hidden="true"></i>
      <h2 class="product-title mb-2">Aún no tienes favoritos</h2>
      <p class="product-info mb-4">Guarda tus velas favoritas para encontrarlas aquí.</p>
      <a href="${catalogoUrl}" class="btn-checkout btn-catalogo">Ir al catálogo</a>
    </article>
  `;
}

// Cambios en los favoritos
function vaciarFavoritos() {
  favoritos = [];

  guardarFavoritos();
  renderFavoritos();
}

// Agregar al carrito desde la tarjeta de favoritos
document.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".add-to-cart");

  if (!boton) return;

  const card = boton.closest("[data-favorito-id]");
  if (!card) return;

  if (typeof agregarAlCarrito === "function") {
    agregarAlCarrito(card.dataset.favoritoId);
  }
});

// Eventos de los botones para quitar y vaciar favoritos
document.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-action]");
  if (!boton) return;

  const { action } = boton.dataset;

  if (action === "clear-favoritos") {
    vaciarFavoritos();
    return;
  }

  const card = boton.closest("[data-favorito-id]");
  if (!card) return;
  const { favoritoId } = card.dataset;

  if (action === "delete") {
    // Desvanecer la tarjeta y quitar de favoritos al terminar la animación
    card.classList.add("fade-out");
    setTimeout(() => quitarFavorito(favoritoId), 300);
  }
});

// Vaciar favoritos y render al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const botonVaciar = document.querySelector(".btn-clear-favoritos");
  if (botonVaciar) {
    botonVaciar.dataset.action = "clear-favoritos";
    botonVaciar.type = "button";
  }

  renderFavoritos();
});
