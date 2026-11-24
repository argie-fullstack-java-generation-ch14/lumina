// Lumina · admin/producto-formulario

window.initProductForm = () => {
	const modal = document.querySelector("#productFormModal");
	const form = modal?.querySelector("#product-form");
	if (!modal || !form) return;

	// Evitar que la rueda del mouse cambie el valor de inputs numéricos
	// (interfiere con el scroll de la página)
	const numberInputs = modal.querySelectorAll('input[type="number"]');
	numberInputs.forEach((input) => {
		input.addEventListener("wheel", (e) => {
			e.preventDefault();
		}, { passive: false });
	});

	const title = modal.querySelector("#productFormModalLabel");
	const submitButton = form.querySelector('button[type="submit"]');
	let editingId = null;

	const fields = [
		{
			input: modal.querySelector("#product-name"),
			validate(value) {
				if (value === "") return "Escribe el nombre de la vela.";
				if (value.length < 2) return "El nombre debe tener al menos 2 caracteres.";
				return "";
			}
		},
		{
			input: modal.querySelector("#product-color"),
			validate(value) {
				if (value === "") return "Escribe el color de la vela.";
				if (value.length < 2) return "El color debe tener al menos 2 caracteres.";
				return "";
			}
		},
		{
			input: modal.querySelector("#product-scent"),
			validate(value) {
				if (value === "") return "Escribe el aroma de la vela.";
				if (value.length < 2) return "El aroma debe tener al menos 2 caracteres.";
				return "";
			}
		},
		{
			input: modal.querySelector("#product-category"),
			validate(value) {
				return value === "" ? "Selecciona una categoría." : "";
			}
		},
		{
			input: modal.querySelector("#product-weight"),
			validate(value) {
				return value === "" ? "Selecciona el peso de la vela." : "";
			}
		},
		{
			input: modal.querySelector("#product-price"),
			validate(value) {
				if (value === "") return "Escribe el precio de la vela.";
				const price = Number(value);
				if (!Number.isFinite(price) || price <= 0) return "El precio debe ser un número mayor que cero.";
				if (!/^\d+(?:\.\d{1,2})?$/.test(value)) return "El precio admite hasta dos decimales.";
				return "";
			}
		},
		{
			input: modal.querySelector("#product-stock"),
			validate(value) {
				if (value === "") return "Escribe el stock disponible.";
				const stock = Number(value);
				if (!Number.isInteger(stock) || stock < 0) return "El stock debe ser un número entero mayor o igual a 0.";
				return "";
			}
		},
		{
			input: modal.querySelector("#product-description"),
			validate(value) {
				if (value === "") return "Escribe una descripción.";
				if (value.length < 10) return "La descripción debe tener al menos 10 caracteres.";
				return "";
			}
		},
		{
			input: modal.querySelector("#product-image"),
			validate(value) {
				if (value === "") return "Escribe la URL de la imagen.";
				try {
					const imageUrl = new URL(value);
					if (imageUrl.protocol !== "http:" && imageUrl.protocol !== "https:") {
						return "La URL debe comenzar con http o https.";
					}
				} catch {
					return "Escribe una URL válida para la imagen.";
				}
				return "";
			}
		}
	];

	function showError(input, message) {
		if (!input) return;
		const field = input.closest(".product-form-field");
		const error = modal.querySelector(`#${input.id}-error`);
		if (error) error.textContent = message;
		if (field) field.classList.toggle("has-error", message !== "");
	}

	function checkField(field) {
		const message = field.validate(field.input.value.trim());
		showError(field.input, message);
		return message === "";
	}

	function checkForm() {
		let firstInvalid = null;
		fields.forEach((field) => {
			if (!checkField(field) && firstInvalid === null) firstInvalid = field.input;
		});
		if (!firstInvalid) return true;
		firstInvalid.focus();
		return false;
	}

	const fieldMap = {
		name: "product-name",
		nombre: "product-name",
		color: "product-color",
		scent: "product-scent",
		aroma: "product-scent",
		category: "product-category",
		categoria: "product-category",
		weightGrams: "product-weight",
		peso: "product-weight",
		price: "product-price",
		precio: "product-price",
		stock: "product-stock",
		available: "product-available",
		description: "product-description",
		descripcion: "product-description",
		imageUrl: "product-image",
		imagen: "product-image"
	};

	window.showProductFormErrors = (apiError) => {
		if (!apiError) return;

		if (Array.isArray(apiError.details) && apiError.details.length > 0) {
			let firstInvalid = null;
			apiError.details.forEach((detail) => {
				const separatorIndex = detail.indexOf(":");
				if (separatorIndex !== -1) {
					const fieldName = detail.substring(0, separatorIndex).trim();
					const msg = detail.substring(separatorIndex + 1).trim();
					const inputId = fieldMap[fieldName] || `product-${fieldName}`;
					const inputEl = modal.querySelector(`#${inputId}`);
					if (inputEl) {
						showError(inputEl, msg);
						if (!firstInvalid) firstInvalid = inputEl;
					}
				}
			});
			if (firstInvalid) firstInvalid.focus();
		} else if (apiError.message) {
			const nameInput = modal.querySelector("#product-name");
			if (nameInput) {
				showError(nameInput, apiError.message);
				nameInput.focus();
			}
		}
	};

	form.addEventListener("submit", async (event) => {
		event.preventDefault();
		if (!checkForm()) return;

		const nameInput = modal.querySelector("#product-name");
		const name = nameInput.value.trim();
		const availableInput = modal.querySelector("#product-available");

		const product = {
			name,
			slug: name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
			imageUrl: modal.querySelector("#product-image").value.trim(),
			color: modal.querySelector("#product-color").value.trim(),
			scent: modal.querySelector("#product-scent").value.trim(),
			category: modal.querySelector("#product-category").value.trim(),
			weightGrams: Number(modal.querySelector("#product-weight").value),
			price: Number(modal.querySelector("#product-price").value),
			stock: Number(modal.querySelector("#product-stock").value),
			available: availableInput ? availableInput.checked : true,
			description: modal.querySelector("#product-description").value.trim()
		};

		if (editingId !== null) {
			// Modo edición: llamar directamente a la función del detalle
			if (typeof window.actualizarProductoEnBackend === "function") {
				await window.actualizarProductoEnBackend(editingId, product);
			} else {
				alert("Error: No se puede actualizar el producto.");
			}
		} else {
			// Modo creación: emitir evento para que el listado lo maneje
			window.dispatchEvent(new CustomEvent("product-created", { detail: product }));
		}
	});

	fields.forEach((field) => {
		["input", "change"].forEach((eventName) => {
			field.input.addEventListener(eventName, () => {
				if (field.input.closest(".product-form-field").classList.contains("has-error")) {
					checkField(field);
				}
			});
		});
	});

	modal.addEventListener("hidden.bs.modal", () => {
		form.reset();
		fields.forEach((field) => showError(field.input, ""));
		const availableInput = modal.querySelector("#product-available");
		if (availableInput) availableInput.checked = true;
		editingId = null;
		if (title) title.textContent = "Agregar producto";
		if (submitButton) {
			submitButton.disabled = false;
			submitButton.textContent = "Agregar producto";
		}
	});

	function preloadProduct(product) {
		const values = {
			"product-name": product.name,
			"product-color": product.color,
			"product-scent": product.scent,
			"product-category": product.category,
			"product-weight": product.weightGrams != null ? String(product.weightGrams) : "",
			"product-price": product.price != null ? String(product.price) : "",
			"product-stock": product.stock != null ? String(product.stock) : "0",
			"product-description": product.description,
			"product-image": product.imageUrl
		};

		Object.entries(values).forEach(([key, value]) => {
			const input = modal.querySelector(`#${key}`);
			if (input) input.value = value ?? "";
		});

		const availableInput = modal.querySelector("#product-available");
		if (availableInput) {
			availableInput.checked = product.available !== false;
		}

		fields.forEach((field) => showError(field.input, ""));
		editingId = product.id;
		if (title) title.textContent = "Editar producto";
		if (submitButton) {
			submitButton.disabled = false;
			submitButton.textContent = "Guardar cambios";
		}
	}

	window.openProductFormForEdit = (product) => {
		preloadProduct(product);
		bootstrap.Modal.getOrCreateInstance(modal).show();
	};

	window.closeProductForm = () => {
		bootstrap.Modal.getOrCreateInstance(modal).hide();
	};

	window.showFormErrors = (error) => {
		if (!error) return;
		if (error.status === 409) {
			alert("No se puede eliminar el producto porque tiene órdenes asociadas.");
		} else if (error.status === 403) {
			alert("No tienes permisos para realizar esta acción.");
		} else {
			alert(error.message || "Ocurrió un error inesperado.");
		}
	};
};
