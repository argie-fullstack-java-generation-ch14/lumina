import { obtenerClaseCategoria, obtenerLabelCategoria } from "../../js/productos.js";

const PRODUCTS_STORAGE_KEY = "lumina-productos";

let productoActual = null;

function loadProducts() {
  try {
    const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    const parsedProducts = savedProducts ? JSON.parse(savedProducts) : [];
    return Array.isArray(parsedProducts) ? parsedProducts : [];
  } catch (error) {
    console.error("No se pudieron recuperar los productos:", error);
    return [];
  }
}

function saveProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("No se pudieron guardar los productos:", error);
  }
}

function renderProducto(producto) {
  document.getElementById("producto-nombre").textContent = producto.name;
  document.title = `${producto.name} · Lumina`;

  const categoria = document.getElementById("producto-categoria");
  categoria.textContent = obtenerLabelCategoria(producto.category);
  categoria.className = `candle-category ${obtenerClaseCategoria(producto.category)}`;

  document.getElementById("producto-aroma").textContent = producto.scent;
  document.getElementById("producto-peso").textContent = `${producto.weightGrams}g`;
  document.getElementById("producto-color").textContent = producto.color;
  document.getElementById("producto-descripcion").textContent = producto.description;
  document.getElementById("producto-precio").textContent =
    `$ ${Number(producto.price).toLocaleString("es-CO")}`;

  const imagen = document.querySelector(".producto-imagen-wrapper-img");
  imagen.src = producto.imageUrl;
  imagen.alt = `Vela Lumina ${producto.name}`;
}

function initProductoDetalle() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const products = loadProducts();
  productoActual = products.find((producto) => producto.id === Number(id)) || products[0];

  if (!productoActual) {
    document.getElementById("producto-nombre").textContent = "Producto no encontrado";
    return;
  }

  renderProducto(productoActual);

  const btnEditar = document.getElementById("btn-editar-producto");
  if (btnEditar) {
    btnEditar.addEventListener("click", () => {
      if (typeof window.openProductFormForEdit === "function") {
        window.openProductFormForEdit(productoActual);
      }
    });
  }

  const btnEliminar = document.getElementById("btn-eliminar-producto");
  const confirmModalEl = document.getElementById("confirmDeleteModal");
  const confirmNameEl = document.getElementById("confirmDeleteName");
  const btnConfirmDelete = document.getElementById("btn-confirm-delete");
  const deleteModal = confirmModalEl ? new bootstrap.Modal(confirmModalEl) : null;

  if (btnEliminar && deleteModal && btnConfirmDelete) {
    btnEliminar.addEventListener("click", () => {
      if (confirmNameEl) confirmNameEl.textContent = productoActual.name;
      deleteModal.show();
    });

    btnConfirmDelete.addEventListener("click", () => {
      const products = loadProducts();
      const filtered = products.filter((p) => p.id !== productoActual.id);
      saveProducts(filtered);
      deleteModal.hide();
      window.location.href = "../productos/index.html";
    });
  }

  window.addEventListener("product-updated", (event) => {
    const { id: updatedId, product } = event.detail;
    const updatedProducts = loadProducts();
    const index = updatedProducts.findIndex((producto) => producto.id === updatedId);
    if (index === -1) return;

    updatedProducts[index] = { ...updatedProducts[index], ...product };
    saveProducts(updatedProducts);
    productoActual = updatedProducts[index];
    renderProducto(productoActual);
  });
}

async function initModal() {
  const mount = document.querySelector("#productFormModalMount");
  if (!mount) return;

  const modalUrl = new URL("../producto-formulario/modal.html", import.meta.url);

  try {
    const response = await fetch(modalUrl);
    if (!response.ok) {
      throw new Error(`No se pudo cargar el formulario (${response.status}).`);
    }
    mount.innerHTML = await response.text();
    window.initProductForm();
  } catch (error) {
    console.error(error);
  }
}

initProductoDetalle();
initModal();
