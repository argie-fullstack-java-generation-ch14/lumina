// Lumina · admin/productos

(() => {
	const PRODUCTS_STORAGE_KEY = "lumina-productos";
	const mount = document.querySelector("#productFormModalMount");
	const productList = document.querySelector("#product-list");

	const categoryInfo = {
		bienestar: { label: "Bienestar", clase: "category-bienestar" },
		descanso: { label: "Descanso", clase: "category-descanso" },
		mindfulness: { label: "Mindfulness", clase: "category-mindfulness" },
		intencion: { label: "Intención", clase: "category-intencion" },
		"amor-propio": { label: "Amor propio", clase: "category-amor-propio" },
		halloween: { label: "Halloween", clase: "category-halloween" },
		navidad: { label: "Navidad", clase: "category-navidad" },
		rituales: { label: "Rituales", clase: "category-rituales" }
	};

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

	function saveProducts() {
		try {
			localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
		} catch (error) {
			console.error("No se pudieron guardar los productos:", error);
		}
	}

	function createTextElement(tagName, className, text) {
		const element = document.createElement(tagName);
		element.className = className;
		element.textContent = text;
		return element;
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
		const infoCategoria = categoryInfo[product.category] || {
			label: product.category,
			clase: "category-default"
		};

		heading.append(
			createTextElement("h3", "", product.name),
			createTextElement(
				"span",
				`candle-category ${infoCategoria.clase}`,
				infoCategoria.label
			)
		);

		const details = document.createElement("div");
		details.className = "candle-details";
		details.append(
			createTextElement("span", "candle-scent", product.scent),
			createTextElement("span", "candle-weight", `${product.weightGrams} g`)
		);

		const description = createTextElement("p", "candle-description", product.description);
		const price = createTextElement("p", "candle-price", `$ ${product.price.toLocaleString("es-CO")}`);
		const purchase = document.createElement("div");
		purchase.className = "candle-purchase";
		purchase.append(price);

		content.append(heading, details, description, purchase);
		card.append(imageContainer, content);
		productList.append(card);

		card.addEventListener("click", (event) => {
			if (event.target.closest("button")) return;
			window.location.href = `../producto-detalle/index.html?id=${product.id}`;
		});
	}

	const products = loadProducts();

	if (products.length === 0) {
		renderEmptyState();
	} else {
		products.forEach(renderProduct);
	}

	window.addEventListener("product-created", (event) => {
		const product = {
			...event.detail,
			id: products.length + 1
		};

		products.push(product);
		saveProducts();

		if (products.length === 1) {
			productList.innerHTML = "";
		}

		renderProduct(product);
	});

	if (!mount) return;

	const modalUrl = new URL("../producto-formulario/modal.html", document.currentScript.src);

	fetch(modalUrl)
		.then((response) => {
			if (!response.ok) throw new Error(`No se pudo cargar el formulario (${response.status}).`);
			return response.text();
		})
		.then((markup) => {
			mount.innerHTML = markup;
			window.initProductForm();
		})
		.catch((error) => console.error(error));
})();
