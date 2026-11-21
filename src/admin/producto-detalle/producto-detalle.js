import { obtenerClaseCategoria } from "../../js/productos.js";

function initProductoDetalle() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const products = JSON.parse(localStorage.getItem("lumina-productos") || "[]");
  const producto = products.find((p) => p.id === Number(id)) || products[0];

  if (!producto) {
    document.getElementById("producto-nombre").textContent = "Producto no encontrado";
    return;
  }

  document.getElementById("producto-nombre").textContent = producto.name;
  document.title = `${producto.name} · Lumina`;

  const categoria = document.getElementById("producto-categoria");
  const clase = obtenerClaseCategoria(producto.category);
  categoria.textContent = producto.category;
  categoria.className = `candle-category ${clase}`;

  document.getElementById("producto-aroma").textContent = producto.scent;
  document.getElementById("producto-peso").textContent = `${producto.weightGrams}g`;
  document.getElementById("producto-color").textContent = producto.color;
  document.getElementById("producto-descripcion").textContent = producto.description;
  document.getElementById("producto-precio").textContent = `$ ${producto.price.toLocaleString("es-CO")}`;

  const imagen = document.querySelector(".producto-imagen-wrapper-img");
  imagen.src = producto.imageUrl;
  imagen.alt = `Vela Lumina ${producto.name}`;
}

initProductoDetalle();
