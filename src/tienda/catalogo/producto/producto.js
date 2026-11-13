function initProducto() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const vela =
    window.velas.find((v) => v.slug === slug) ?? window.velas[0];

  document.getElementById("producto-nombre").textContent = vela.name;

  const categoria = document.getElementById("producto-categoria");
  categoria.textContent = vela.category;
  categoria.className = `candle-category ${window.obtenerClaseCategoria(
    vela.category
  )}`;

  document.getElementById("producto-aroma").textContent = vela.scent;
  document.getElementById("producto-peso").textContent = `${vela.weight}g`;
  document.getElementById("producto-color").textContent = vela.color;
  document.getElementById("producto-descripcion").textContent =
    vela.description;
  document.getElementById("producto-precio").textContent = `$ ${vela.price.toLocaleString(
    "es-CO"
  )}`;

  const imagen = document.querySelector(".producto-imagen-wrapper-img");
  imagen.src = vela.img;
  imagen.alt = `Vela Lumina ${vela.name}`;

  document.title = `${vela.name} · Lumina`;

  const botonCarrito = document.getElementById("btn-agregar-carrito");
  botonCarrito.dataset.productId = vela.id;
  botonCarrito.addEventListener("click", () => {
    if (typeof agregarAlCarrito === "function") {
      agregarAlCarrito(vela.id);
    }
  });
}

if (window.velas) {
  initProducto();
} else {
  window.addEventListener("velas-listadas", initProducto, { once: true });
}
