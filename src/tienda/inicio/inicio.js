// Lumina · inicio
// Solo esta página.
//
// Banner de la página de inicio. Hace tres cosas:
//   1) El título aparece letra por letra, como humo que se condensa.
//   2) La frase de bienvenida sube letra por letra (idea del SplitText de React Bits,
//      pero hecha solo con CSS y JS, sin GSAP).
//   3) Humo suave que sigue al cursor por toda la página (el motor está en splash-cursor.js).
//
// Nota: en la home este archivo se carga DESPUÉS de que el HTML ya existe,
// por eso no usamos DOMContentLoaded: arrancamos directo.

(function initHomeHero() {
  const hero = document.getElementById("home-hero");
  if (!hero || hero.dataset.ready) return; // evita iniciarlo dos veces
  hero.dataset.ready = "true";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const title = hero.querySelector(".home-hero-title");
  const lead = hero.querySelector(".home-hero-lead");
  const button = hero.querySelector(".home-hero-button");


  /* ==========================================================
   * 1) PARTIR TEXTO EN LETRAS
   * Convierte "Hola mundo" en <span palabra><span letra>H</span>...</span>
   * Cada letra recibe --i (su número) para escalonar la animación en CSS.
   * Devuelve cuántas letras (y espacios) hay.
   * ========================================================== */
  function splitIntoChars(root, prefix) {
    let count = 0;

    function build(node) {
      const fragment = document.createDocumentFragment();

      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          // separamos por espacios para mantener las palabras completas
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;

            if (/^\s+$/.test(part)) {
              fragment.appendChild(document.createTextNode(" "));
              count++;
              return;
            }

            const word = document.createElement("span");
            word.className = `${prefix}-word`;
            word.setAttribute("aria-hidden", "true");

            for (const letter of part) {
              const char = document.createElement("span");
              char.className = `${prefix}-char`;
              char.style.setProperty("--i", count++);
              char.textContent = letter;
              word.appendChild(char);
            }
            fragment.appendChild(word);
          });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const copy = child.cloneNode(false); // por ejemplo un <br>
          copy.appendChild(build(child));
          fragment.appendChild(copy);
        }
      });

      return fragment;
    }

    // los lectores de pantalla leen el texto completo, no letra por letra
    root.setAttribute("aria-label", root.textContent.replace(/\s+/g, " ").trim());

    const letters = build(root);
    root.textContent = "";
    root.appendChild(letters);

    return count;
  }


  /* ==========================================================
   * 2) TÍTULO Y FRASE
   * Esperamos a que cargue la fuente (Recoleta) para que no se vea el
   * cambio de letra en medio de la animación.
   * ========================================================== */
  function waitForFonts() {
    if (!document.fonts) return Promise.resolve();
    const loading = document.fonts.load('400 1em "Recoleta"').catch(() => {});
    const timeout = new Promise((resolve) => setTimeout(resolve, 1500)); // por si tarda mucho
    return Promise.race([loading, timeout]);
  }

  if (!reducedMotion) {
    title.style.visibility = "hidden";

    waitForFonts().then(() => {
      // título: letras que se condensan como humo
      splitIntoChars(title, "smoke");
      title.classList.add("is-smoke-ready");
      title.style.visibility = "";

      // frase: queda oculta y sube letra por letra un momento después
      const total = splitIntoChars(lead, "split");
      hero.classList.add("is-animated");
      if (button) button.style.setProperty("--i", total + 4); // el botón entra al final

      setTimeout(() => hero.classList.add("is-playing"), 900);
    });
  }



  /* ==========================================================
   * 3) HUMO QUE SIGUE AL CURSOR (en toda la página)
   * El motor (simulación de fluidos con WebGL) está en splash-cursor.js.
   * Creamos un canvas fijo que cubre toda la ventana y no estorba los clics.
   * ========================================================== */
  if (typeof window.createSplashCursor === "function" && !reducedMotion) {
    const smokeCanvas = document.createElement("canvas");
    smokeCanvas.className = "page-smoke";
    smokeCanvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(smokeCanvas);

    window.createSplashCursor(smokeCanvas, {
      colors: ["#8f78d9"], // morado
      rainbow: false,
      intensity: 0.2,      // más bajo = más sutil
      size: 1.1,           // tamaño de la mancha de humo
      force: 0.8,          // qué tanto empuja el cursor
      swirl: 3,            // remolinos
      trail: 1.3,          // cuánto dura la estela
      momentum: 1.2,
      shading: 0.5,
      glow: 0,
      quality: "medium",
      clickSplash: false,  // sin explosión al hacer clic
      intro: true,         // una pasada de humo al cargar
      contained: false,    // por toda la ventana, no solo en el banner
      theme: "light",      // "light" se ve sobre fondos claros
    });
  }
})();
