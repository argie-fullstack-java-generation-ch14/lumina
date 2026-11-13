(function () {
  const MODAL_ID = "checkoutModal";
  const COMPONENT_DIR = new URL("./", document.currentScript.src).href;

  let modalInstance = null;

  async function insertMarkup() {
    if (document.getElementById(MODAL_ID)) {
      initModal();
      return;
    }

    try {
      const response = await fetch(new URL("index.html", COMPONENT_DIR));
      if (!response.ok) {
        throw new Error(`Error ${response.status} al cargar checkout-modal/index.html`);
      }

      const html = await response.text();
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html.trim();

      const modalEl = wrapper.querySelector(".modal");
      if (!modalEl) {
        throw new Error("checkout-modal/index.html no contiene un elemento .modal");
      }

      document.body.appendChild(modalEl);
      initModal();
    } catch (error) {
      console.error("Error al inyectar checkout-modal:", error);
    }
  }

  function initModal() {
    if (modalInstance) return;

    const el = document.getElementById(MODAL_ID);
    if (!el || typeof bootstrap === "undefined") return;

    modalInstance = new bootstrap.Modal(el);

    const form = el.querySelector(".payment-form");
    const confirmation = el.querySelector(".payment-confirmation");
    const orderNumber = el.querySelector(".order-number");

    function resetCheckout() {
      if (form) form.hidden = false;
      if (confirmation) confirmation.hidden = true;
    }

    // Al cerrar la modal, reinicia al estado de formulario de pago.
    el.addEventListener("hidden.bs.modal", resetCheckout);

    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const numero = `L-${Math.floor(1000 + Math.random() * 9000)}`;
        if (orderNumber) {
          orderNumber.textContent = numero;
        }

        if (form) {
          form.hidden = true;
        }
        if (confirmation) {
          confirmation.hidden = false;
        }

        const cards = document.querySelectorAll("#cart-items-container .cart-item-card");
        cards.forEach((card) => card.classList.add("fade-out"));

        setTimeout(() => {
          if (typeof vaciarCarrito === "function") {
            vaciarCarrito();
          }
        }, 300);
      });
    }
  }

  function openModal() {
    if (!modalInstance) {
      initModal();
    }
    if (modalInstance) {
      modalInstance.show();
    }
  }

  // Delegación: cualquier botón "Finalizar compra" del resumen abre el modal.
  document.body.addEventListener("click", (event) => {
    const button = event.target.closest("button.btn-checkout");
    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    openModal();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", insertMarkup);
  } else {
    insertMarkup();
  }

  window.initCheckoutModal = initModal;
})();
