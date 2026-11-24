// Lumina · Modal de feedback de producto
// ------------------------------------------------------------
// Avisos de éxito/error al crear o actualizar productos.

let mostrada = false;
let estilosInyectados = false;

function inyectarEstilos() {
  if (estilosInyectados || document.getElementById("lumina-producto-feedback-styles")) {
    estilosInyectados = true;
    return;
  }

  const style = document.createElement("style");
  style.id = "lumina-producto-feedback-styles";
  style.textContent = `
    #lumina-producto-feedback {
      position: fixed;
      inset: 0;
      z-index: 100000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      font-family: var(--fuente-texto, "Montserrat", system-ui, sans-serif);
    }
    #lumina-producto-feedback .lumina-feedback-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(59, 44, 44, 0.55);
      backdrop-filter: blur(2px);
    }
    #lumina-producto-feedback .lumina-feedback-dialog {
      position: relative;
      width: 100%;
      max-width: 420px;
      background: #ffffff;
      color: var(--cafe-lumina, #3B2C2C);
      border-radius: 20px;
      padding: 2.25rem 1.75rem 2rem;
      text-align: center;
      box-shadow: 0 20px 50px rgba(19, 18, 15, 0.25);
      animation: lumina-feedback-in 0.2s ease-out;
    }
    @keyframes lumina-feedback-in {
      from { opacity: 0; transform: translateY(8px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    #lumina-producto-feedback .lumina-feedback-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    #lumina-producto-feedback .lumina-feedback-icon svg {
      width: 30px;
      height: 30px;
    }
    #lumina-producto-feedback .lumina-feedback-title {
      margin: 0 0 0.5rem;
      font-family: var(--fuente-titulos, "Fraunces", Georgia, serif);
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--cafe-lumina, #3B2C2C);
    }
    #lumina-producto-feedback .lumina-feedback-text {
      margin: 0 0 1.75rem;
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--negro-relajacion, #33302D);
    }
    #lumina-producto-feedback .lumina-feedback-ok {
      width: 100%;
      border: none;
      border-radius: 50px;
      padding: 0.8rem 2rem;
      background: var(--naranja-apagado, #AD784E);
      color: #ffffff;
      font-family: var(--fuente-texto, "Montserrat", system-ui, sans-serif);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }
    #lumina-producto-feedback .lumina-feedback-ok:hover { background: #c07a4a; }
    #lumina-producto-feedback .lumina-feedback-ok:active { transform: scale(0.99); }
    #lumina-producto-feedback .lumina-feedback-ok:focus-visible {
      outline: 3px solid rgba(173, 120, 78, 0.45);
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
  estilosInyectados = true;
}

function icono(tipo) {
  if (tipo === "exito") {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
  }
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  `;
}

function construirModal(titulo, mensaje, tipo, onAceptar) {
  if (document.getElementById("lumina-producto-feedback")) return;

  inyectarEstilos();
  document.body.style.overflow = "hidden";

  const colorFondo = tipo === "exito" ? "var(--verde-apagado, #7C9474)" : "var(--naranja-apagado, #AD784E)";
  const colorTexto = "#ffffff";

  const overlay = document.createElement("div");
  overlay.id = "lumina-producto-feedback";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "lumina-feedback-title");
  overlay.innerHTML = `
    <div class="lumina-feedback-backdrop"></div>
    <div class="lumina-feedback-dialog" role="document">
      <div class="lumina-feedback-icon" aria-hidden="true" style="background: ${colorFondo}; color: ${colorTexto};">
        ${icono(tipo)}
      </div>
      <h2 class="lumina-feedback-title" id="lumina-feedback-title">${titulo}</h2>
      <p class="lumina-feedback-text">${mensaje}</p>
      <button type="button" class="lumina-feedback-ok" id="lumina-feedback-ok">Aceptar</button>
    </div>
  `;

  document.body.appendChild(overlay);

  const boton = overlay.querySelector("#lumina-feedback-ok");
  boton.focus();
  boton.addEventListener("click", () => {
    cerrarFeedbackProducto();
    if (typeof onAceptar === "function") onAceptar();
  });
}

export function cerrarFeedbackProducto() {
  const overlay = document.getElementById("lumina-producto-feedback");
  if (overlay) {
    overlay.remove();
    document.body.style.overflow = "";
  }
  mostrada = false;
}

export function mostrarProductoActualizado(onAceptar) {
  if (mostrada) return;
  mostrada = true;
  construirModal("Producto actualizado", "El producto se guardó con éxito.", "exito", onAceptar);
}

export function mostrarErrorProducto(mensaje, onAceptar) {
  if (mostrada) return;
  mostrada = true;
  construirModal("Error al actualizar", mensaje || "No se pudo actualizar el producto.", "error", onAceptar);
}
