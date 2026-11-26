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
      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Verificar que exista sesión
        const token = localStorage.getItem("token");
        const usuarioActivo = localStorage.getItem("usuarioActivo");

        if (!token || !usuarioActivo) {
          alert("Debes iniciar sesión para realizar una compra.");
          const loginUrl = new URL("tienda/login/index.html", new URL(".", document.currentScript.src).href).href;
          window.location.href = loginUrl;
          return;
        }

        const usuario = JSON.parse(usuarioActivo);

        const numero = `L-${Math.floor(1000 + Math.random() * 9000)}`;
        if (orderNumber) {
          orderNumber.textContent = numero;
        }

        // Obtener cupón si se aplicó
        const cuponInput = document.getElementById("couponInput");
        const couponCode = cuponInput ? cuponInput.value.trim() : undefined;

        // Llamar al backend para crear el pedido
        if (
          typeof obtenerProductosCarrito === "function" &&
          typeof calcularTotales === "function"
        ) {
          const productosCarrito = obtenerProductosCarrito();
          const totales = calcularTotales(productosCarrito);

          try {
            const { crearPedido } = await import("../../api/services/pedidos.service.js");

            const pedidoResponse = await crearPedido({
              usuarioId: usuario.id,
              items: productosCarrito.map((p) => ({
                productId: p.id,
                quantity: p.quantity
              })),
              couponCode
            }, token);

            // Mostrar número de orden real del backend
            if (orderNumber && pedidoResponse.orderNumber) {
              orderNumber.textContent = pedidoResponse.orderNumber;
            }
          } catch (error) {
            console.error("Error al crear pedido:", error);
            alert("Error al procesar el pedido. Intenta de nuevo.");
            return;
          }
        } else {
          // Fallback si no hay funciones del carrito
          if (orderNumber) {
            orderNumber.textContent = numero;
          }
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
