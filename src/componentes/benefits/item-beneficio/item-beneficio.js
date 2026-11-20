// Lumina · item-beneficio
// Componente: tarjeta de un beneficio de Lumina (imagen + título + texto).
// Se llena con el array BENEFICIOS: cambia la imagen, el título o el
// texto desde ahí.

// Cada objeto del array alimenta una tarjeta del grid de beneficios
const BENEFICIOS = [
  {
    imagen: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1794021978/generation/lumina/benefits/bienestar_y0r7qc.png",
    titulo: "Bienestar",
    texto: "Velas y rituales para tu equilibrio",
  },
  {
    imagen: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1794021978/generation/lumina/benefits/descanso_cyaice.png",
    titulo: "Descanso",
    texto: "Aromas que calman tu mente y cuerpo",
  },
  {
    imagen: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1794021979/generation/lumina/benefits/mindfulness_rr3xc4.png",
    titulo: "Mindfulness",
    texto: "Momento de presencia y atención plena",
  },
  {
    imagen: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1794021978/generation/lumina/benefits/amor-propio_oet0su.png",
    titulo: "Amor Propio",
    texto: "Nutriendo tu ser con compasión y cuidado",
  },
  {
    imagen: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1794021979/generation/lumina/benefits/intencion_igh2rx.png",
    titulo: "Intención",
    texto: "Guiando tu camino hacia tu propósito",
  },
];

// Template string: tarjeta de un beneficio
function crearBenefitItem(beneficio) {
  return `
    <div class="benefit-item">
      <img class="benefit-img" src="${beneficio.imagen}" alt="${beneficio.titulo}">
      <h4 class="mb-0">${beneficio.titulo}</h4>
      <p class="mb-0">${beneficio.texto}</p>
    </div>
  `;
}

// Pinta los beneficios en el contenedor de benefits.html
// (como badge.js: se ejecuta al cargar el script porque en la home la
// sección ya está inyectada cuando ui.js agrega este script)
const contenedorBeneficios = document.getElementById("beneficios-fila");

if (contenedorBeneficios) {
  contenedorBeneficios.innerHTML = BENEFICIOS.map(crearBenefitItem).join("");
}
