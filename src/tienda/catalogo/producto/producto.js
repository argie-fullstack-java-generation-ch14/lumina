import { productos, obtenerClaseCategoria, obtenerLabelCategoria } from "../../../js/productos.js";

function initProducto() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const producto =
    productos.find((p) => p.slug === slug) ?? productos[0];

  if (!producto) {
    document.getElementById("producto-nombre").textContent = "Producto no encontrado";
    return;
  }

  document.getElementById("producto-nombre").textContent = producto.name;

    const btnFavorito = document.querySelector(".producto-favorite-button");
    if (btnFavorito && typeof esFavorito === "function") {
      btnFavorito.dataset.productId = producto.id;
      const estaEnFavoritos = esFavorito(producto.id);
      btnFavorito.setAttribute("aria-pressed", String(estaEnFavoritos));
      btnFavorito.setAttribute(
        "aria-label",
        estaEnFavoritos
          ? `Quitar ${producto.name} de favoritos`
          : `Agregar ${producto.name} a favoritos`
      );
      btnFavorito.setAttribute(
        "data-bs-title",
        estaEnFavoritos ? "Quitar de favoritos" : "Agregar a favoritos"
      );
      const icono = btnFavorito.querySelector("i");
      icono.className = estaEnFavoritos ? "fa-solid fa-heart" : "fa-regular fa-heart";
      icono.setAttribute("aria-hidden", "true");

      new bootstrap.Tooltip(btnFavorito);
    }

  const categoria = document.getElementById("producto-categoria");
  categoria.textContent = producto.category;
  categoria.className = `candle-category ${obtenerClaseCategoria(
    producto.category
  )}`;

  document.getElementById("producto-aroma").textContent = producto.scent;
  document.getElementById("producto-peso").textContent = `${producto.weightGrams}g`;
  document.getElementById("producto-color").textContent = producto.color;
  document.getElementById("producto-descripcion").textContent =
    producto.description;
  document.getElementById("producto-precio").textContent = `$ ${producto.price.toLocaleString(
    "es-CO"
  )}`;

  const imagen = document.querySelector(".producto-imagen-wrapper-img");
  imagen.src = producto.imageUrl;
  imagen.alt = `Vela Lumina ${producto.name}`;

  document.title = `${producto.name} · Lumina`;

  const botonCarrito = document.getElementById("btn-agregar-carrito");
  botonCarrito.dataset.productId = producto.id;
  botonCarrito.addEventListener("click", () => {
    if (typeof agregarAlCarrito === "function") {
      agregarAlCarrito(producto.id);
    }
  });
}

window.addEventListener("productos-listadas", initProducto);

if (!window.productosCargando && productos.length > 0) {
  initProducto();
}
