// Lumina · about-us.js

const team = [
  {
    name: "Pedro Saravia",
    role: "Frontend Developer",
    description: "Interesado en explorar cómo la tecnología puede ayudarnos a resolver problemas.",
    photo: "https://media.licdn.com/dms/image/v2/D4E03AQHrpKo2mP_wDw/profile-displayphoto-scale_400_400/B4EaDVOVPOIgAg-/0/1790283703833?e=1793232000&v=beta&t=2q0yrxdpz9BMr2G-fw-oUpOnVGdZkINdas3m656hbPY",
    linkedin: "https://www.linkedin.com/in/pedrosq/",
    github: "https://github.com/psaraviaq"
  },
  {
    name: "Argie Rincón",
    role: "Full Stack Developer",
    description: "Apasionada de la arquitectura de software y la creación de experiencias digitales enfocadas en el usuario.",
    photo: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1791561044/IMG_1545_2_zw8gnn.jpg",
    linkedin: "https://www.linkedin.com/in/argierincon/",
    github: "https://github.com/argierincon"
  },
  {
    name: "Nicole Betancourt",
    role: "Full Stack Developer",
    description: "Aprendiendo Full Stack con Java. Me apasionan la música y aprender algo nuevo cada día. Me gusta convertir ideas en código.",
    photo: "../../image/nicole.jpg",
    linkedin: "https://www.linkedin.com/in/nicole-betancourt-alvarez-nba/",
    github: "https://github.com/NBA-Nicole"
  },
  {
    name: "Nayant Gonzalez",
    role: "UI Designer / Full Stack Developer",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed dolor finibus, mattis urna sit amet, porta quam. ",
    photo: "",
    linkedin: "https://www.linkedin.com/in/[TU USUARIO]/",
    github: "https://github.com/[TU USUARIO]"
  }
];

function createCardTemplate(person) {
  return `
    <div class="card dev-card">

      <img src="${person.photo}" class="card-size-img card-img-top" alt="${person.name}'s profile picture">

      <div class="card-body dev-info">
        <div class="dev-info-header">
          <h5 class="card-title">${person.name}</h5>
          <h6 class="card-subtitle text-body-secondary">${person.role}</h6>
          <p class="card-text dev-info-description">${person.description}</p>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <a href="${person.linkedin}" target="_blank" class="btn btn-outline-primary" aria-label="${person.name}'s LinkedIn profile">
            <i class="bi bi-linkedin me-2"></i>LinkedIn
          </a>
          <a href="${person.github}" target="_blank" class="btn btn-outline-dark" aria-label="${person.name}'s GitHub profile">
            <i class="bi bi-github me-2"></i>GitHub
          </a>
        </div>
      </div>

    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const aboutUsContainer = document.getElementById("about-us");

  if (aboutUsContainer) {
    const cardsMarkup = team.map(person => createCardTemplate(person)).join("");

    aboutUsContainer.innerHTML = `
      <h2 class="text-center mb-4">SOBRE NOSOTROS</h2>
      <div id="cards-container" class="d-flex flex-wrap gap-3 justify-content-between">
        ${cardsMarkup}
      </div>
    `;
  }
});