function crearCardCarrusel(vela) {
  const claseCategoria = obtenerClaseCategoria(vela.category);

  return `
    <div class="carousel-item">
      <img class="carousel-item__img"
        src="${vela.img}"
        alt="Vela Lumina ${vela.name}">

      <button
        class="favorite-button"
        type="button"
        aria-label="Agregar ${vela.name} a favoritos"
        aria-pressed="false">

        <i class="fa-regular fa-heart"
           aria-hidden="true"></i>

      </button>

      <div class="candle-content">

        <div class="candle-heading">
          <h3>${vela.name}</h3>

          <span class="candle-category ${claseCategoria}">
            ${vela.category}
          </span>
        </div>

        <div class="candle-details">

          <span class="candle-scent">
            <i class="fa-solid fa-bottle-droplet" aria-hidden="true"></i>
            ${vela.scent}
          </span>

          <span class="candle-weight">
            ${vela.weight}g
          </span>

        </div>

        <p class="candle-description">
          ${vela.description}
        </p>

        <div class="candle-purchase">
          <p class="candle-price">
            $ ${vela.price.toLocaleString("es-CO")}
          </p>

          <button class="add-to-cart" type="button" aria-label="Agregar ${vela.name} al carrito">
            Agregar al carrito
          </button>
        </div>

      </div>
    </div>
  `;
}

function paso(pista) {
  const card = pista.querySelector(".carousel-item");
  return card ? card.offsetWidth + 10 : 280;
}

function desplazar(pista, distancia) {
  pista.scrollBy({ left: distancia, behavior: "smooth" });
}

function retroceder(pista, anchoCiclo, distancia) {
  if (pista.scrollLeft < distancia) {
    pista.scrollLeft += anchoCiclo;
  }
  requestAnimationFrame(() => {
    desplazar(pista, -distancia);
  });
}

function activarControles(montaje, pista, anchoCiclo, intervalo = 1800) {
  if (pista.dataset.carruselListo) {
    return;
  }
  pista.dataset.carruselListo = "true";

  pista.addEventListener("scroll", () => {
    if (pista.scrollLeft >= anchoCiclo) {
      pista.scrollLeft -= anchoCiclo;
    }
  });

  montaje.querySelector(".carousel__flecha--derecha")
    ?.addEventListener("click", () => desplazar(pista, paso(pista)));

  montaje.querySelector(".carousel__flecha--izquierda")
    ?.addEventListener("click", () => retroceder(pista, anchoCiclo, paso(pista)));

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let temporizador = setInterval(
      () => desplazar(pista, paso(pista)),
      intervalo
    );

    pista.addEventListener("mouseenter", () => clearInterval(temporizador));
    pista.addEventListener("mouseleave", () => {
      clearInterval(temporizador);
      temporizador = setInterval(
        () => desplazar(pista, paso(pista)),
        intervalo
      );
    });
  }
}

function crearCarrusel(selector, opciones = {}) {
  const montaje = typeof selector === "string"
    ? document.querySelector(selector)
    : selector;

  if (!montaje) {
    return null;
  }

  const velas = opciones.velas;

  if (!Array.isArray(velas) || velas.length === 0) {
    return null;
  }

  montaje.innerHTML = `
    <div class="carousel-zona">

      <button
        class="carousel__flecha carousel__flecha--izquierda"
        type="button"
        aria-label="Ir a la card anterior">
        <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
      </button>

      <section class="carousel">
        <div class="carousel__container"></div>
      </section>

      <button
        class="carousel__flecha carousel__flecha--derecha"
        type="button"
        aria-label="Ir a la card siguiente">
        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </button>

    </div>
  `;

  const pista = montaje.querySelector(".carousel");
  const contenedor = montaje.querySelector(".carousel__container");

  const base = velas.map(crearCardCarrusel).join("");


  contenedor.innerHTML = base + base;

  const items = contenedor.querySelectorAll(".carousel-item");
  const anchoCiclo = items[items.length / 2].offsetLeft - items[0].offsetLeft;

  let repeticiones = 0;
  while (pista.scrollWidth < pista.clientWidth + anchoCiclo * 2 && repeticiones < 8) {
    contenedor.innerHTML += base;
    repeticiones++;
  }

  activarControles(montaje, pista, anchoCiclo, opciones.intervalo);

  return {
    siguiente: () => desplazar(pista, paso(pista)),
    anterior: () => retroceder(pista, anchoCiclo, paso(pista))
  };
}
