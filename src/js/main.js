
// Lumina · main
// Global: header y footer compartidos y, en la home, inyección del contenido
// de cada página dentro de su sección.

document.addEventListener("DOMContentLoaded", async () => {
  await renderPartial("#header", "header/header.html");
  initHeader();

  // La burbujita del carrito puede haberse quedado sin pintar si
  // renderCarrito corrió antes de que el header existiera (recargas).
  if (typeof refrescarBurbujaCarrito === "function") {
    refrescarBurbujaCarrito();
  }

  await renderPartial("#footer", "footer/footer.html");

  // Las secciones solo aplican en el index raíz; en los módulos el id
  // coincidiría y se re-inyectaría.
  if (document.body.dataset.page !== "home") return;

  const routes = {
    "#inicio": "tienda/inicio/index.html",
    "#beneficios": "componentes/benefits/benefits.html",
    "#favs-de-temporada": "tienda/catalogo/favoritos-de-temporada/favoritos-de-temporada.html",
    "#catalogo": "tienda/catalogo/index.html",
    "#nosotros": "tienda/nosotros/index.html",
    "#contacto": "tienda/contacto/index.html",
  };

  Object.entries(routes).forEach(([selector, path]) => {
    renderSection(selector, path);
  });
});

/* ==========================================================
   HEADER
   - Marca el enlace de la página donde estás.
   - Muestra el nombre del usuario si inició sesión.
   - El icono de cuenta abre un dropdown solo sin sesión:
     muestra "Iniciar sesión" y "Registrarse".
   - Con sesión activa, el clic lleva directo a Mi cuenta.
   - Permite cerrar sesión.
========================================================== */

function initHeader() {
  // Marca la página actual en el menú.
  document.querySelectorAll(".site-nav-link[data-page]").forEach((link) => {
    if (location.pathname.includes(`/tienda/${link.dataset.page}/`)) {
      link.setAttribute("aria-current", "page");
    }
  });

  // Elementos de la cuenta.
  const accountLink = document.getElementById("site-account-link");
  const accountMenu = document.getElementById("site-account-menu");
  const accountName = document.getElementById("site-account-name");
  const loginItem = document.getElementById("site-account-login");
  const registerItem = document.getElementById("site-account-register");
  const logoutButton = document.getElementById("site-logout-button");

  if (!accountLink || !accountName || !logoutButton) return;

  // Rutas desde la carpeta src/.
  const loginUrl = new URL("tienda/login/index.html", APP_BASE).href;
  const accountUrl = new URL("tienda/mi-cuenta/index.html", APP_BASE).href;

  // Recupera el usuario que inició sesión.
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("usuarioActivo") || "null");
  } catch (error) {
    console.error("Error al recuperar el usuario:", error);
  }

  if (user && user.nombreCompleto) {
    const partesNombre = user.nombreCompleto.trim().split(/\s+/);
    const nombre = partesNombre[0];

    const inicialApellido = partesNombre.length > 1
      ? partesNombre[1].charAt(0).toUpperCase()
      : "";

    // Muestra el nombre en el Header.
    accountName.hidden = false;
    accountName.textContent = `${nombre} ${inicialApellido}`;

    accountLink.classList.remove("site-account-compact");

    // Con sesión activa no hay dropdown: el clic lleva directo a Mi cuenta.
    accountLink.removeAttribute("data-bs-toggle");
    accountLink.removeAttribute("data-bs-auto-close");
    accountLink.removeAttribute("aria-expanded");
    accountLink.setAttribute("aria-label", "Mi cuenta");

    if (accountMenu) {
      accountMenu.hidden = true;
    }

    accountLink.onclick = () => {
      window.location.href = accountUrl;
    };

    // Muestra el botón Cerrar sesión.
    logoutButton.hidden = false;

    new bootstrap.Tooltip(logoutButton);

  } else {
    // Si no hay sesión activa, el dropdown ofrece iniciar sesión o registrarse.
    accountName.hidden = true;
    accountName.textContent = "";

    // Sin nombre, el botón queda cuadrado (círculo) como carrito y favoritos.
    accountLink.classList.add("site-account-compact");
    loginItem.hidden = false;
    loginItem.href = loginUrl;
    registerItem.hidden = false;

    logoutButton.hidden = true;
  }

  // Acción para cerrar sesión.
  logoutButton.onclick = () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = loginUrl;
  };
}

/* CARRITO */

function setCartCount(total) {
  const badge = document.getElementById("cart-count");

  if (!badge) return;

  badge.textContent = total;
  badge.hidden = !total;
}
