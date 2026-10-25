// Lumina · crear vela

function createSlug(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

function initCandleForm() {
  const form = document.querySelector("#crear-form");
  if (!form) return;

  const catalogo = [];

  const fields = [
    {
      input: document.querySelector("#crear-nombre"),
      validate(value) {
        if (value === "") return "Escribe el nombre de la vela.";
        if (value.length < 2) return "El nombre debe tener al menos 2 caracteres.";
        return "";
      }
    },
    {
      input: document.querySelector("#crear-aroma"),
      validate(value) {
        if (value === "") return "Escribe el aroma de la vela.";
        if (value.length < 2) return "El aroma debe tener al menos 2 caracteres.";
        return "";
      }
    },
    {
      input: document.querySelector("#crear-categoria"),
      validate(value) {
        return value === "" ? "Selecciona una categoría." : "";
      }
    },
    {
      input: document.querySelector("#crear-peso"),
      validate(value) {
        return value === "" ? "Selecciona el peso de la vela." : "";
      }
    },
    {
      input: document.querySelector("#crear-precio"),
      validate(value) {
        if (value === "") return "Escribe el precio de la vela.";
        const price = Number(value);
        if (!Number.isFinite(price) || price <= 0) return "El precio debe ser un número mayor que cero.";
        if (!/^\d+(?:\.\d{1,2})?$/.test(value)) return "El precio admite hasta dos decimales.";
        return "";
      }
    },
    {
      input: document.querySelector("#crear-descripcion"),
      validate(value) {
        if (value === "") return "Escribe una descripción.";
        if (value.length < 10) return "La descripción debe tener al menos 10 caracteres.";
        return "";
      }
    }
  ];
  const [nameField, scentField, categoryField, weightField, priceField, descriptionField] = fields;

  function showError(input, message) {
    const wrapper = input.closest(".crear-field");
    const errorText = document.querySelector(`#${input.id}-error`);
    errorText.textContent = message;
    wrapper.classList.toggle("has-error", message !== "");
    input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
  }

  function checkField(field) {
    const message = field.validate(field.input.value.trim());
    showError(field.input, message);
    return message === "";
  }

  function checkForm() {
    let firstInvalid = null;
    fields.forEach((field) => {
      if (!checkField(field) && firstInvalid === null) {
        firstInvalid = field.input;
      }
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!checkForm()) return;

    const nuevaVela = {
      id: catalogo.length + 1,
      name: nameField.input.value.trim(),
      slug: createSlug(nameField.input.value),
      img: "https://gstatic.com/images",
      scent: scentField.input.value.trim(),
      category: categoryField.input.selectedOptions[0].textContent.trim(),
      weight: Number(weightField.input.value),
      description: descriptionField.input.value.trim(),
      price: Number(priceField.input.value)
    };
    catalogo.push(nuevaVela);

    console.log("Vela creada:", nuevaVela);
    console.log("Velas creadas en esta sesión:", catalogo);
    console.log(`Total de velas creadas: ${catalogo.length}`);

    form.reset();
  });

  fields.forEach((field) => {
    field.input.addEventListener("input", () => {
      if (field.input.closest(".crear-field").classList.contains("has-error")) {
        checkField(field);
      }
    });
    field.input.addEventListener("change", () => {
      if (field.input.closest(".crear-field").classList.contains("has-error")) {
        checkField(field);
      }
    });
  });
}

initCandleForm();