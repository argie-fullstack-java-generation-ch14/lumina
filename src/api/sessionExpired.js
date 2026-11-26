// Lumina · Modal de sesión expirada
// ------------------------------------------------------------
// Aviso con los estilos del proyecto cuando el token vence.
// El usuario confirma y recién ahí se le redirige a su login correspondiente.

let mostrada = false;
let estilosInyectados = false;

export function resolverLoginDestino() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo") || "null");
    if (usuario && (usuario.role === "ADMIN" || usuario.role === "STAFF")) {
      return "/src/admin/login/index.html";
    }
  } catch (error) {
    // Si no se puede leer el usuario, se decide por la ruta actual
  }

  return window.location.pathname.includes("/admin/")
    ? "/src/admin/login/index.html"
    : "/src/tienda/login/index.html";
}

function inyectarEstilos() {
  if (estilosInyectados || document.getElementById("lumina-session-expired-styles")) {
    estilosInyectados = true;
    return;
  }

  const style = document.createElement("style");
  style.id = "lumina-session-expired-styles";
  style.textContent = `
    #lumina-session-expired {
      position: fixed;
      inset: 0;
      z-index: 100000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      font-family: var(--fuente-texto, "Montserrat", system-ui, sans-serif);
    }
    #lumina-session-expired .lumina-session-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(59, 44, 44, 0.55);
      backdrop-filter: blur(2px);
    }
    #lumina-session-expired .lumina-session-dialog {
      position: relative;
      width: 100%;
      max-width: 420px;
      background: #ffffff;
      color: var(--cafe-lumina, #3B2C2C);
      border-radius: 20px;
      padding: 2.25rem 1.75rem 2rem;
      text-align: center;
      box-shadow: 0 20px 50px rgba(19, 18, 15, 0.25);
      animation: lumina-session-in 0.2s ease-out;
    }
    @keyframes lumina-session-in {
      from { opacity: 0; transform: translateY(8px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    #lumina-session-expired .lumina-session-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--naranja-claro, #F9F1E8);
      color: var(--naranja-apagado, #AD784E);
    }
    #lumina-session-expired .lumina-session-icon svg {
      width: 30px;
      height: 30px;
    }
    #lumina-session-expired .lumina-session-title {
      margin: 0 0 0.5rem;
      font-family: var(--fuente-titulos, "Fraunces", Georgia, serif);
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--cafe-lumina, #3B2C2C);
    }
    #lumina-session-expired .lumina-session-text {
      margin: 0 0 1.75rem;
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--negro-relajacion, #33302D);
    }
    #lumina-session-expired .lumina-session-ok {
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
    #lumina-session-expired .lumina-session-ok:hover { background: #c07a4a; }
    #lumina-session-expired .lumina-session-ok:active { transform: scale(0.99); }
    #lumina-session-expired .lumina-session-ok:focus-visible {
      outline: 3px solid rgba(173, 120, 78, 0.45);
      outline-offset: 2px;
    }
  `;

  document.head.appendChild(style);
  estilosInyectados = true;
}

function construirModal(destino) {
  if (document.getElementById("lumina-session-expired")) return;

  inyectarEstilos();

  const overlay = document.createElement("div");
  overlay.id = "lumina-session-expired";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "lumina-session-title");
  overlay.innerHTML = `
    <div class="lumina-session-backdrop"></div>
    <div class="lumina-session-dialog" role="document">
      <div class="lumina-session-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
             stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 7v5l3 2"></path>
        </svg>
      </div>
      <h2 class="lumina-session-title" id="lumina-session-title">Sesión expirada</h2>
      <p class="lumina-session-text">
        Tu sesión ha expirado por seguridad. Vuelve a iniciar sesión para continuar.
      </p>
      <button type="button" class="lumina-session-ok" id="lumina-session-ok">Aceptar</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  const boton = overlay.querySelector("#lumina-session-ok");
  boton.focus();
  boton.addEventListener("click", () => {
    window.location.href = destino;
  });
}

export function mostrarSesionExpirada(destino) {
  if (mostrada) return;
  mostrada = true;

  const destinoFinal = destino || resolverLoginDestino();

  if (document.body) {
    construirModal(destinoFinal);
  } else {
    document.addEventListener("DOMContentLoaded", () => construirModal(destinoFinal), { once: true });
  }
}
