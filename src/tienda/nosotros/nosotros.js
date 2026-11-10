
// ========================================
// LUMINA - NOSOTROS
// Información de los integrantes
// ========================================

const integrantes = {
  naya: {
    nombre: "Nayant Gonzalez",
    rol: "UI Designer / Full Stack Developer",
    descripcion: "Apasionada por el UI y el diseño, aprendiendo Full Stack para crear soluciones web funcionales, intuitivas y atractivas.",
    foto: "https://res.cloudinary.com/zj7mojiw/image/upload/v1794279449/Retrato_c%C3%A1lido_de_Naya_con_cabello_ondulado.png",
    linkedin: "https://www.linkedin.com/in/nayagonzalezd/",
    github: "https://github.com/nayagonzalezd"
  },

  argie: {
    nombre: "Argie Rincón",
    rol: "Full Stack Developer",
    descripcion: "Apasionada de la arquitectura de software y la creación de experiencias digitales enfocadas en el usuario.",
    foto: "https://res.cloudinary.com/zj7mojiw/image/upload/v1794279449/Retrato_elegante_en_tonos_beige_argie.png",
    linkedin: "https://www.linkedin.com/in/argierincon/",
    github: "https://github.com/argierincon"
  },

  pedro: {
    nombre: "Pedro Saravia",
    rol: "Frontend Developer",
    descripcion: "Interesado en explorar cómo la tecnología puede ayudarnos a resolver problemas.",
    foto: "https://res.cloudinary.com/zj7mojiw/image/upload/v1794279449/Retrato_c%C3%A1lido_con_fondo_org%C3%A1nico_pedro.png",
    linkedin: "https://www.linkedin.com/in/pedrosq/",
    github: "https://github.com/psaraviaq"
  },

  nicole: {
    nombre: "Nicole Betancourt",
    rol: "Full Stack Developer",
    descripcion: "Aprendiendo Full Stack con Java. Me apasionan la música y aprender algo nuevo cada día. Me gusta convertir ideas en código.",
    foto: "https://res.cloudinary.com/zj7mojiw/image/upload/v1794279452/Retrato_c%C3%A1lido_de_Nicole_con_gafas.png",
    linkedin: "https://www.linkedin.com/in/nicole-betancourt-alvarez-nba/",
    github: "https://github.com/NBA-Nicole"
  }
};

// ========================================
// ELEMENTOS DEL MODAL
// ========================================

const memberModal = document.getElementById("memberModal");
const closeMemberModal = document.getElementById("closeMemberModal");

const modalPhoto = document.getElementById("modalPhoto");
const modalName = document.getElementById("modalName");
const modalRole = document.getElementById("modalRole");
const modalDescription = document.getElementById("modalDescription");

const modalLinkedin = document.getElementById("modalLinkedin");
const modalGithub = document.getElementById("modalGithub");

let elementoAnterior = null;

// ========================================
// ABRIR MODAL
// ========================================

function abrirModal(integranteId) {

  const integrante = integrantes[integranteId];

  if (!integrante || !memberModal) {
    return;
  }

  elementoAnterior = document.activeElement;

  // Mostrar fotografía
  modalPhoto.src = integrante.foto;
  modalPhoto.alt = `Retrato de ${integrante.nombre}`;

  // Mostrar información
  modalName.textContent = integrante.nombre;
  modalRole.textContent = integrante.rol;
  modalDescription.textContent = integrante.descripcion;

  // Enlace de LinkedIn
  modalLinkedin.href = integrante.linkedin;

  // Enlace de GitHub
  modalGithub.href = integrante.github;

  // Mostrar ventana
  memberModal.classList.add("active");
  memberModal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  closeMemberModal.focus();
}

// ========================================
// CERRAR MODAL
// ========================================

function cerrarModal() {

  if (!memberModal) {
    return;
  }

  memberModal.classList.remove("active");
  memberModal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  if (elementoAnterior) {
    elementoAnterior.focus();
  }
}

// ========================================
// EVENTOS DE LAS FOTOGRAFIAS
// ========================================

document.querySelectorAll(".team-photo").forEach((boton) => {

  boton.addEventListener("click", () => {

    const integranteId = boton.dataset.member;

    abrirModal(integranteId);

  });

});

// ========================================
// EVENTOS PARA CERRAR LA VENTANA
// ========================================

// Botón X
if (closeMemberModal) {
  closeMemberModal.addEventListener("click", cerrarModal);
}

// Clic fuera de la tarjeta
if (memberModal) {

  memberModal.addEventListener("click", (evento) => {

    if (evento.target === memberModal) {
      cerrarModal();
    }

  });

}

// Tecla Escape
document.addEventListener("keydown", (evento) => {

  if (
    evento.key === "Escape" &&
    memberModal?.classList.contains("active")
  ) {
    cerrarModal();
  }

});
