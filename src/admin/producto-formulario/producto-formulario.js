// Lumina · admin/producto-formulario

window.initProductForm = () => {
	const modal = document.querySelector("#productFormModal");
	const form = modal?.querySelector("#product-form");
	if (!modal || !form) return;

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
		const field = input.closest(".product-form-field");
		const error = modal.querySelector(`#${input.id}-error`);
		error.textContent = message;
		field.classList.toggle("has-error", message !== "");
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

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		if (!checkForm()) return;

		const name = fields[0].input.value.trim();
		const product = {
			name,
			slug: name.toLowerCase().replace(/\s+/g, "-"),
			img: fields[6].input.value.trim(),
			scent: fields[1].input.value.trim(),
			category: fields[2].input.selectedOptions[0].textContent.trim(),
			weight: Number(fields[3].input.value),
			price: Number(fields[4].input.value),
			description: fields[5].input.value.trim()
		};

		console.log("Vela creada:", product);
		window.dispatchEvent(new CustomEvent("product-created", { detail: product }));
		bootstrap.Modal.getOrCreateInstance(modal).hide();
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
	});
};
