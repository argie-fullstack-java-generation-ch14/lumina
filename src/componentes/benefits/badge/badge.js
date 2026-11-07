const BADGES = [
  { icono: "fa-wheat-awn", linea1: "100% Cera de", linea2: "Soya Natural" },
  { icono: "fa-paw", linea1: "Cruelty", linea2: "Free" },
  { icono: "fa-leaf", linea1: "Producto", linea2: "Vegano" },
  { icono: "fa-spray-can-sparkles", linea1: "Aromas", linea2: "Duraderos" },
  { icono: "fa-truck-fast", linea1: "Envíos a", linea2: "Todo el País" },
  { icono: "fa-hand-sparkles", linea1: "Hecha", linea2: "a Mano" }
];

// Template string: tarjeta de un badge
function crearBadge(badge) {
  return `
    <div class="badge-item">
      <i class="fa-solid ${badge.icono}" aria-hidden="true"></i>
      <p>
        ${badge.linea1}
        <span class="badge-linea-2">${badge.linea2}</span>
      </p>
    </div>
  `;
}

const contenedorBadges = document.getElementById("badges-fila");

if (contenedorBadges) {
  contenedorBadges.innerHTML = BADGES.map(crearBadge).join("");
}
