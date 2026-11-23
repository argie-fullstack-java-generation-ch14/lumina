// Lumina · admin/productos
// Conexión con la API REST del backend para listar y crear productos.

import { obtenerTodas, crearProducto } from "../../api/services/productos.service.js";
import { obtenerClaseCategoria, obtenerLabelCategoria } from "../../js/productos.js";

const mount = document.querySelector("#productFormModalMount");
const productList = document.querySelector("#product-list");

let productosActuales = [];

function createTextElement(tagName, className, text) {
	const element = document.createElement(tagName);
	element.className = className;
	element.textContent = text;
	return element;
}

function renderLoadingState() {
	if (!productList) return;
	productList.innerHTML = `
		<div class="col-10 mx-auto placeholder-wrap text-center py-5">
			<div class="spinner-border text-secondary mb-3" role="status">
				<span class="visually-hidden">Cargando...</span>
			</div>
			<p class="product-info">Cargando productos desde el backend...</p>
		</div>
	`;
}

function renderEmptyState() {
	if (!productList) return;
	productList.innerHTML = `
		<div class="col-10 mx-auto placeholder-wrap">
			<article class="card cart-empty p-5 text-center">
				<i class="fa-solid fa-face-frown mb-3" aria-hidden="true"></i>
				<h2 class="product-title mb-2">Sin productos creados</h2>
				<p class="product-info mb-4">Agrega tu primer producto para comenzar.</p>
			</article>
		</div>
	`;
}

function renderErrorState(errorMessage) {
	if (!productList) return;
	productList.innerHTML = `
		<div class="col-10 mx-auto placeholder-wrap">
			<article class="card cart-empty p-5 text-center border-danger">
				<i class="fa-solid fa-triangle-exclamation mb-3 text-danger" aria-hidden="true"></i>
				<h2 class="product-title mb-2 text-danger">Error al cargar productos</h2>
				<p class="product-info mb-4">${errorMessage || "No se pudo conectar con el backend."}</p>
				<button class="btn-seguir-comprando mx-auto" type="button" id="btn-reintentar-productos">Reintentar</button>
			</article>
		</div>
	`;
	const btnReintentar = productList.querySelector("#btn-reintentar-productos");
	if (btnReintentar) {
		btnReintentar.addEventListener("click", cargarProductos);
	}
}

function renderProduct(product) {
	if (!productList) return;

	const card = document.createElement("article");
	card.className = "candle-card";

	const imageContainer = document.createElement("div");
	imageContainer.className = "candle-link";

	const image = document.createElement("img");
	image.className = "candle-image";
	image.src = product.imageUrl;
	image.alt = `Vela Lumina ${product.name}`;
	image.loading = "lazy";
	imageContainer.append(image);

	const content = document.createElement("div");
	content.className = "candle-content";

	const heading = document.createElement("div");
	heading.className = "candle-heading";

	const labelCategoria = obtenerLabelCategoria(product.category);
	const claseCategoria = obtenerClaseCategoria(product.category);

	heading.append(
		createTextElement("h3", "candle-title", product.name),
		createTextElement("span", `candle-category ${claseCategoria}`, labelCategoria)
	);

	const details = document.createElement("div");
	details.className = "candle-details";
	details.append(
		createTextElement("span", "candle-scent", product.scent || "Sin aroma"),
		createTextElement("span", "candle-weight", `${product.weightGrams ?? 0} g`)
	);

	const description = createTextElement("p", "candle-description", product.description || "");
	const priceFormatted = Number(product.price || 0).toLocaleString("es-CO");
	const price = createTextElement("p", "candle-price", `$ ${priceFormatted}`);

	const purchase = document.createElement("div");
	purchase.className = "candle-purchase d-flex justify-content-between align-items-center";
	purchase.append(price);

	const stockBadge = document.createElement("span");
	const isAvailable = product.available !== false && (product.stock == null || product.stock > 0);
	stockBadge.className = `badge ${isAvailable ? "bg-success" : "bg-secondary"}`;
	stockBadge.textContent = product.stock != null ? `Stock: ${product.stock}` : (isAvailable ? "Disponible" : "Agotado");
	purchase.append(stockBadge);

	content.append(heading, details, description, purchase);
	card.append(imageContainer, content);
	productList.append(card);

	card.addEventListener("click", (event) => {
		if (event.target.closest("button")) return;
		window.location.href = `../producto-detalle/index.html?id=${product.id}`;
	});
}

async function cargarProductos() {
	renderLoadingState();
	try {
		productosActuales = await obtenerTodas();
		if (!productList) return;
		productList.innerHTML = "";
		if (!productosActuales || productosActuales.length === 0) {
			renderEmptyState();
		} else {
			productosActuales.forEach(renderProduct);
		}
	} catch (error) {
		console.error("Error al obtener productos:", error);
		renderErrorState(error.message);
	}
}

window.addEventListener("product-created", async (event) => {
	const newProductData = event.detail;
	try {
		await crearProducto(newProductData);
		if (typeof window.closeProductForm === "function") {
			window.closeProductForm();
		}
		await cargarProductos();
	} catch (error) {
		console.error("Error al crear producto en backend:", error);
		if (typeof window.showProductFormErrors === "function") {
			window.showProductFormErrors(error);
		} else {
			alert(error.message || "Error al crear el producto.");
		}
	}
});

async function initModalMount() {
	if (!mount) return;

	try {
		const modalUrl = new URL("../producto-formulario/modal.html", import.meta.url);
		const response = await fetch(modalUrl);
		if (!response.ok) throw new Error(`No se pudo cargar el formulario (${response.status}).`);
		mount.innerHTML = await response.text();
		if (typeof window.initProductForm === "function") {
			window.initProductForm();
		}
	} catch (error) {
		console.error("Error al cargar el modal de formulario:", error);
	}
}

// Inicialización
cargarProductos();
initModalMount();
