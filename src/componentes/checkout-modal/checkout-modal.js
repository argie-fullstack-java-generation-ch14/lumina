(function () {
  const MODAL_ID = "checkoutModal";
  const COMPONENT_DIR = new URL("./", document.currentScript.src).href;
  const PEDIDOS_GUARDADOS_KEY = "lumina-pedidos";

  let modalInstance = null;

  function fechaFormateada() {
    const ahora = new Date();
    const partes = ahora.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).split(" ");
    // partes: ["13", "de", "noviembre", "2026"]
    const mes = partes[2];
    const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
    return `${partes[0]} de ${mesCapitalizado} ${partes[3]}`;
  }

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

        // Guarda el pedido en localStorage para que aparezca en "Mis pedidos".
        if (
          typeof obtenerProductosCarrito === "function" &&
          typeof calcularTotales === "function"
        ) {
          const productosCarrito = obtenerProductosCarrito();
          const totales = calcularTotales(productosCarrito);

          const pedido = {
            fecha: fechaFormateada(),
            numeroOrden: numero,
            estado: "PENDIENTE",
            abierto: true,
            productos: productosCarrito.map((p) => ({
              id: p.id,
              name: p.name,
              img: p.img,
              scent: p.scent,
              weight: p.weight,
              color: p.color,
              price: p.price
            })),
            totales
          };

          let guardados = [];
          try {
            guardados = JSON.parse(localStorage.getItem(PEDIDOS_GUARDADOS_KEY) || "[]");
            if (!Array.isArray(guardados)) guardados = [];
          } catch (error) {
            console.error("Error al leer pedidos guardados:", error);
            guardados = [];
          }

          guardados.unshift(pedido);
          localStorage.setItem(PEDIDOS_GUARDADOS_KEY, JSON.stringify(guardados));
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
