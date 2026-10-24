// Lumina · crear vela

function initCandleForm() {
  const form = document.querySelector("#crear-form");
  const formStatus = document.querySelector("#crear-form-status");
  if (!form || !formStatus) return;

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
    formStatus.textContent = "";

    if (!checkForm()) return;

    formStatus.textContent = "Los datos son válidos. El guardado todavía no está conectado.";
  });

  fields.forEach((field) => {
    field.input.addEventListener("input", () => {
      formStatus.textContent = "";
      if (field.input.closest(".crear-field").classList.contains("has-error")) {
        checkField(field);
      }
    });
    field.input.addEventListener("change", () => {
      formStatus.textContent = "";
      if (field.input.closest(".crear-field").classList.contains("has-error")) {
        checkField(field);
      }
    });
  });
}

initCandleForm();