import { obtenerPorId, actualizarProducto, eliminarProducto } from "../../api/services/productos.service.js";
import { obtenerClaseCategoria, obtenerLabelCategoria } from "../../js/productos.js";
import { mostrarProductoActualizado, mostrarErrorProducto } from "../../api/productoFeedback.js";

let productoActual = null;

function renderProducto(producto) {
	document.getElementById("producto-nombre").textContent = producto.name;
	document.title = `${producto.name} · Lumina`;

	const categoria = document.getElementById("producto-categoria");
	categoria.textContent = obtenerLabelCategoria(producto.category);
	categoria.className = `candle-category ${obtenerClaseCategoria(producto.category)}`;

	document.getElementById("producto-aroma").textContent = producto.scent || "Sin aroma";
	document.getElementById("producto-peso").textContent = `${producto.weightGrams}g`;
	document.getElementById("producto-color").textContent = producto.color;
	document.getElementById("producto-descripcion").textContent = producto.description;
	document.getElementById("producto-precio").textContent = `$ ${Number(producto.price).toLocaleString("es-CO")}`;
	document.getElementById("producto-stock").textContent = producto.stock != null ? `${producto.stock} unidades` : "Sin registro";

	const availableEl = document.getElementById("producto-available");
	const isAvailable = producto.available !== false;
	availableEl.textContent = isAvailable ? "Disponible" : "No disponible";
	availableEl.className = `badge ${isAvailable ? "bg-success" : "bg-secondary"}`;

	const imagen = document.querySelector(".producto-imagen-wrapper-img");
	imagen.src = producto.imageUrl;
	imagen.alt = `Vela Lumina ${producto.name}`;
}

function showViewError(message) {
	document.getElementById("producto-nombre").textContent = "Producto no encontrado";
	document.getElementById("producto-descripcion").textContent = message;
	document.getElementById("btn-editar-producto").disabled = true;
	document.getElementById("btn-eliminar-producto").disabled = true;
}

async function eliminarProductoActual() {
	try {
		await eliminarProducto(productoActual.id);
		window.location.href = "../productos/";
	} catch (error) {
		console.error("Error al eliminar producto:", error);
		if (error.status === 409) {
			alert("No se puede eliminar el producto porque tiene órdenes asociadas.");
		} else if (error.status === 403) {
			alert("No tienes permisos para eliminar productos.");
		} else {
			alert(error.message || "Ocurrió un error al eliminar el producto.");
		}
	}
}

async function actualizarProductoEnBackend(id, product) {
	try {
		productoActual = await actualizarProducto(id, product);
		renderProducto(productoActual);
		if (typeof window.closeProductForm === "function") {
			window.closeProductForm();
		}
		mostrarProductoActualizado();
	} catch (error) {
		console.error("Error al actualizar producto:", error);
		if (error.status === 403) {
			mostrarErrorProducto("No tienes permisos para editar productos.");
		} else if (error.status === 400 && typeof window.showProductFormErrors === "function") {
			window.showProductFormErrors(error);
			mostrarErrorProducto("Revisa los campos marcados en el formulario.");
		} else {
			mostrarErrorProducto(error.message || "No se pudo actualizar el producto.");
		}
	}
}

async function cargarProducto() {
	const id = Number(new URLSearchParams(window.location.search).get("id"));
	if (!id || Number.isNaN(id)) {
		showViewError("No se especificó un producto válido.");
		return;
	}

	try {
		productoActual = await obtenerPorId(id);
		if (!productoActual) {
			showViewError("El producto solicitado no existe.");
			return;
		}
		renderProducto(productoActual);
		configurarEventos();
	} catch (error) {
		console.error("Error al obtener el producto:", error);
		showViewError(error.message || "No se pudo conectar con el backend.");
	}
}

function configurarEventos() {
	document.getElementById("btn-editar-producto").addEventListener("click", () => {
		if (typeof window.openProductFormForEdit === "function") {
			window.openProductFormForEdit(productoActual);
		}
	});

	const confirmModalEl = document.getElementById("confirmDeleteModal");
	const deleteModal = confirmModalEl ? new bootstrap.Modal(confirmModalEl) : null;

	document.getElementById("btn-eliminar-producto").addEventListener("click", () => {
		document.getElementById("confirmDeleteName").textContent = productoActual.name;
		deleteModal.show();
	});

	document.getElementById("btn-confirm-delete").addEventListener("click", async () => {
		const btn = document.getElementById("btn-confirm-delete");
		btn.disabled = true;
		btn.textContent = "Eliminando...";
		await eliminarProductoActual();
		btn.disabled = false;
		btn.textContent = "Eliminar";
	});
}

async function initModal() {
	const mount = document.querySelector("#productFormModalMount");
	if (!mount) return;

	const modalUrl = new URL("../producto-formulario/modal.html", import.meta.url);

	try {
		const response = await fetch(modalUrl);
		if (!response.ok) throw new Error(`No se pudo cargar el formulario (${response.status}).`);
		mount.innerHTML = await response.text();
		window.initProductForm();
	} catch (error) {
		console.error(error);
	}
}

async function init() {
	await initModal();
	await cargarProducto();
}

// Exportar función para el formulario
window.actualizarProductoEnBackend = actualizarProductoEnBackend;

init();