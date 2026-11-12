// Lumina · favoritos
// La lista de favoritos vive en localStorage: cada entrada referencia a velas
// del catálogo (js/velas.js) y `quantity` son las unidades deseadas.
// La vista en tienda/favoritos usa estas funciones junto con carrito.js para
// las cards promocionales.

const CLAVE_FAVORITOS = "lumina-favoritos";

// Carpeta de este script: resuelve la ruta de la vista de favoritos
// correctamente en todas las páginas donde se comparte
const FAVORITOS_URL = new URL(
  "../tienda/favoritos/index.html",
  new URL(".", document.currentScript.src).href
).href;

function cargarFavoritos() {
  try {
    const favoritosGuardados = localStorage.getItem(CLAVE_FAVORITOS);

    if (!favoritosGuardados) {
      return [];
    }

    const datos = JSON.parse(favoritosGuardados);

    if (!Array.isArray(datos)) {
      return [];
    }

    return datos
      .filter(item =>
        velas.some(vela => vela.id === Number(item.id)) &&
        Number.isInteger(Number(item.quantity)) &&
        Number(item.quantity) > 0
      )
      .map(item => ({
        id: Number(item.id),
        quantity: Math.min(99, Number(item.quantity))
      }));

  } catch (error) {
    console.error("Error al recuperar los favoritos:", error);
    return [];
  }
}

function guardarFavoritos() {
  localStorage.setItem(
    CLAVE_FAVORITOS,
    JSON.stringify(favoritos)
  );
}

let favoritos = [];

// Inicializa favoritos solo cuando el catálogo de velas está disponible.
function initFavoritos() {
  favoritos = cargarFavoritos();
}

if (window.velas) {
  initFavoritos();
} else {
  window.addEventListener("velas-listadas", initFavoritos, { once: true });
}

// Asocia cada item de favoritos con los datos del catálogo (js/velas.js)
function obtenerProductosFavoritos() {
  return favoritos
    .map((item) => {
      const vela = velas.find((v) => v.id === item.id);
      return vela ? { ...vela, quantity: item.quantity } : null;
    })
    .filter(Boolean);
}

// ¿Está una vela en favoritos?
function esFavorito(id) {
  const idBuscado = Number(id);
  return favoritos.some(item => item.id === idBuscado);
}

// Agregar una vela a favoritos (sin duplicados)
function agregarFavorito(id) {
  const idVela = Number(id);

  if (!velas.some(vela => vela.id === idVela)) {
    console.error("La vela no existe en el catálogo.");
    return;
  }

  if (esFavorito(idVela)) {
    return;
  }

  favoritos.push({
    id: idVela,
    quantity: 1
  });

  guardarFavoritos();
}

function quitarFavorito(id) {
  const index = favoritos.findIndex((item) => item.id === Number(id));
  if (index === -1) return;

  favoritos.splice(index, 1);

  guardarFavoritos();

  // La vista de favoritos se re-renderiza si estamos en ella
  if (typeof renderFavoritos === "function") {
    renderFavoritos();
  }
}

// Agregar o quitar una vela de favoritos (toggle del corazón).
// Devuelve `true` si quedó como favorito.
function alternarFavorito(id) {
  const idVela = Number(id);

  if (!velas.some(vela => vela.id === idVela)) {
    console.error("La vela no existe en el catálogo.");
    return false;
  }

  if (esFavorito(idVela)) {
    quitarFavorito(idVela);
    return false;
  }

  agregarFavorito(idVela);
  return true;
}

// Sincroniza el corazón de las cards de una vela (catálogo, carrusel y
// duplicated en el carrusel) con el estado de favoritos
function pintarCorazonFavorito(id, esFavoritoAhora) {
  const vela = velas.find((v) => v.id === Number(id));

  document
    .querySelectorAll(`.favorite-button[data-product-id="${Number(id)}"]`)
    .forEach((boton) => {
      boton.setAttribute("aria-pressed", String(esFavoritoAhora));
      boton.setAttribute(
        "aria-label",
        esFavoritoAhora
          ? `Quitar ${vela.name} de favoritos`
          : `Agregar ${vela.name} a favoritos`
      );

      const icono = boton.querySelector("i");
      icono.classList.toggle("fa-regular", !esFavoritoAhora);
      icono.classList.toggle("fa-solid", esFavoritoAhora);

      if (window.bootstrap && boton.hasAttribute("data-bs-toggle")) {
        const tooltip = bootstrap.Tooltip.getInstance(boton);

        if (tooltip) {
          tooltip.setContent({
            "bs.title": esFavoritoAhora
              ? "Quitar de favoritos"
              : "Agregar a favoritos"
          });
        }
      }
    });
}

// Notificación cuando se guarda una vela en favoritos
// (reutiliza los estilos de .cart-toast en css/main.css)
function mostrarNotificacionFavorito(vela) {
  let notificacion = document.getElementById("favoritos-toast");

  if (!notificacion) {
    notificacion = document.createElement("div");
    notificacion.id = "favoritos-toast";
    notificacion.className = "cart-toast";
    document.body.appendChild(notificacion);
  }

  notificacion.innerHTML = `
    <div class="cart-toast-header">
      <i class="fa-solid fa-heart"></i>
      <strong>¡Añadido a tus favoritos!</strong>
      <button type="button" class="cart-toast-close" aria-label="Cerrar">
        &times;
      </button>
    </div>

    <div class="cart-toast-content">
      <img src="${vela.img}" alt="${vela.name}">
      <div>
        <strong>${vela.name}</strong>
        <p>Aquí la encontrarás cuando quieras.</p>
      </div>
    </div>

    <a class="cart-toast-cta" href="${FAVORITOS_URL}">
      Ver favoritos
      <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </a>
  `;

  notificacion.classList.add("show");

  clearTimeout(notificacion.timeoutId);

  notificacion.timeoutId = setTimeout(() => {
    notificacion.classList.remove("show");
  }, 4000);

  notificacion.querySelector(".cart-toast-close").addEventListener("click", () => {
    notificacion.classList.remove("show");
  });
}

// Corazón de las cards: guarda o quita la vela de favoritos al pulsarlo
document.addEventListener("click", function (evento) {
  const boton = evento.target.closest(".favorite-button");

  if (!boton) {
    return;
  }

  const esFavoritoAhora = alternarFavorito(boton.dataset.productId);

  pintarCorazonFavorito(boton.dataset.productId, esFavoritoAhora);

  if (!esFavoritoAhora) {
    return;
  }

  const velaAgregada = velas.find(
    (v) => v.id === Number(boton.dataset.productId)
  );

  mostrarNotificacionFavorito(velaAgregada);
});
