// Lumina · inicio
// Solo esta página.
//
// Banner de la página de inicio. Hace tres cosas:
//   1) La imagen se abre (se expande) mientras haces scroll.
//   2) El título aparece letra por letra, como humo que se condensa, y la frase
//      de bienvenida sube letra por letra.
//   3) Humo suave que sigue al cursor (el motor está en splash-cursor.js).
//
// Nota: en la home este archivo se carga DESPUÉS de que el HTML ya existe,
// por eso no uso DOMContentLoaded: arrancamos directo.

(function initHeroBanner() {
  const banner = document.getElementById("hero-banner");
  if (!banner || banner.dataset.ready) return; // evita iniciarlo dos veces
  banner.dataset.ready = "true";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Elementos que vamos a mover
  const track = banner.querySelector(".hero-track");
  const stage = banner.querySelector(".hero-stage");
  const frame = banner.querySelector(".hero-frame");
  const media = banner.querySelector(".hero-media");
  const title = banner.querySelector(".hero-title");
  const overlay = banner.querySelector(".hero-overlay");
  const lead = banner.querySelector(".hero-lead");
  const button = banner.querySelector(".hero-rise");
  const scrimBottom = banner.querySelector(".hero-scrim-bottom");
  const hint = banner.querySelector(".hero-hint");


  /* ==========================================================
   * 1) PARTIR TEXTO EN LETRAS
   * Convierte "Hola mundo" en <span palabra><span letra>H</span>...</span>
   * Cada letra recibe --i (su número) para escalonar la animación en CSS.
   * Respeta etiquetas como <br> para no perder los saltos de línea.
   * ========================================================== */
  function splitIntoChars(root) {
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
            word.className = smokeOrSplit(root, "word");
            word.setAttribute("aria-hidden", "true");

            for (const letter of part) {
              const char = document.createElement("span");
              char.className = smokeOrSplit(root, "char");
              char.style.setProperty("--i", count++);
              char.textContent = letter;
              word.appendChild(char);
            }
            fragment.appendChild(word);
          });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const copy = child.cloneNode(false); // por ejemplo el <br>
          copy.appendChild(build(child));
          fragment.appendChild(copy);
        }
      });

      return fragment;
    }

    // el título usa las clases smoke-*, la frase usa split-*
    function smokeOrSplit(el, kind) {
      return (el === title ? "smoke-" : "split-") + kind;
    }

    // los lectores de pantalla leen la frase completa, no letra por letra
    root.setAttribute("aria-label", root.textContent.replace(/\s+/g, " ").trim());

    const letters = build(root);
    root.textContent = "";
    root.appendChild(letters);

    return count; // cuántas letras (y espacios) hay
  }


  /* ==========================================================
   * 2) TÍTULO: letras que se condensan como humo
   * Espera a que cargue la fuente (Recoleta) para que no se vea el cambio
   * de letra en medio de la animación.
   * ========================================================== */
  function waitForFonts() {
    if (!document.fonts) return Promise.resolve();
    const loading = document.fonts.load('400 1em "Recoleta"').catch(() => {});
    const timeout = new Promise((resolve) => setTimeout(resolve, 1500)); // por si tarda mucho
    return Promise.race([loading, timeout]);
  }

  if (title && !reducedMotion) {
    title.style.visibility = "hidden";
    waitForFonts().then(() => {
      splitIntoChars(title);
      title.classList.add("is-smoke-ready");
      title.style.visibility = "";
    });
  }


  /* ==========================================================
   * 3) FRASE DE BIENVENIDA: sube letra por letra (SplitText)
   * Se reproduce cuando la imagen ya está casi abierta, y se reinicia
   * si vuelves a subir, para que se repita al abrir otra vez.
   * ========================================================== */
  let leadIsPlaying = false;

  if (lead && !reducedMotion) {
    const total = splitIntoChars(lead);
    // el botón entra justo después de la última letra
    if (button) button.style.setProperty("--i", total + 4);
  }

  function playLead() {
    if (leadIsPlaying) return;
    leadIsPlaying = true;
    overlay.classList.add("is-playing");
  }

  function resetLead() {
    if (!leadIsPlaying) return;
    leadIsPlaying = false;
    overlay.classList.remove("is-playing");
  }


  /* ==========================================================
   * 4) SCROLL EXPAND
   * "progress" va de 0 (imagen pequeña) a 1 (pantalla completa).
   * Con eso calculamos el recorte (clip-path), el zoom de la foto,
   * lo que se desvanece y lo que aparece.
   * ========================================================== */
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  // curva suave: arranca y termina despacio
  const smoothstep = (a, b, x) => {
    const t = clamp((x - a) / (b - a || 1e-6), 0, 1);
    return t * t * (3 - 2 * t);
  };

  const config = {
    startWidth: 44,    // % del ancho que ocupa la foto al empezar
    startHeight: 62,   // % del alto
    startRadius: 24,   // esquinas redondeadas (px)
    endRadius: 0,
    mediaZoom: 1.3,    // la foto empieza más "acercada"
    scrollDistance: 1, // pantallas de scroll que dura la expansión
    holdDistance: 0.3, // pantallas extra con la foto ya abierta
    smoothing: 0.1,    // más alto = movimiento más suave/lento
    scrimBottom: 0.85, // oscuridad abajo para que se lea el texto
  };

  let stageHeight = 0;
  let current = 0;  // progreso que se está dibujando
  let target = 0;   // progreso al que queremos llegar
  let running = false;
  let raf = 0;

  function applyProgress(p) {
    // la foto termina de abrirse antes del final del scroll (en 0.92),
    // así nunca queda un borde ni margen cuando ya está abierta
    const e = smoothstep(0, 0.92, p);

    const width = config.startWidth + (100 - config.startWidth) * e;
    const height = config.startHeight + (100 - config.startHeight) * e;
    const insideX = Math.max(0, (100 - width) / 2);
    const insideY = Math.max(0, (100 - height) / 2);
    const radius = config.startRadius + (config.endRadius - config.startRadius) * e;

    frame.style.clipPath =
      e >= 1 ? "none" : `inset(${insideY}% ${insideX}% ${insideY}% ${insideX}% round ${radius}px)`;
    media.style.transform = `scale(${config.mediaZoom + (1 - config.mediaZoom) * e})`;
    scrimBottom.style.opacity = String(config.scrimBottom * e);

    // el título se desvanece y sube un poco mientras la foto se abre
    const titleOut = smoothstep(0.45, 0.9, p);
    title.style.opacity = String(1 - titleOut);
    title.style.transform = `translate3d(0, ${-28 * titleOut}px, 0)`;

    // "Desliza" desaparece apenas empieza el scroll
    hint.style.opacity = String(1 - smoothstep(0, 0.12, p));

    // texto de bienvenida: se reproduce al final, se reinicia al volver arriba
    if (p > 0.8) playLead();
    else if (p < 0.35) resetLead();

    // si el usuario pidió menos movimiento, solo mostramos/ocultamos
    if (reducedMotion) overlay.style.opacity = String(smoothstep(0.7, 1, p));
  }

  function readProgress() {
    const distance = stageHeight * config.scrollDistance;
    return clamp(-track.getBoundingClientRect().top / distance, 0, 1);
  }

  // El banner debe ocupar TODO el ancho de la ventana, sin márgenes.
  // Si el body o algún contenedor le deja espacio a los lados, aquí se corrige.
  function fitFullWidth() {
    banner.style.marginLeft = "0px";
    banner.style.width = "auto";
    const rect = banner.getBoundingClientRect();
    const viewport = document.documentElement.clientWidth;
    if (Math.abs(rect.left) > 0.5 || Math.abs(rect.width - viewport) > 0.5) {
      banner.style.marginLeft = `${-rect.left}px`;
      banner.style.width = `${viewport}px`;
    }
  }

  function measure() {
    fitFullWidth();
    stageHeight = stage.clientHeight;
    if (stageHeight <= 0) return;

    // la pista de scroll es más alta que la pantalla: de ahí sale el recorrido
    track.style.height = `${stageHeight * (1 + config.scrollDistance + config.holdDistance)}px`;

    // en celular la foto empieza más ancha
    const small = window.matchMedia("(max-width: 860px)").matches;
    config.startWidth = small ? 78 : 44;
    config.startHeight = small ? 54 : 62;

    // el título nunca debe ser más ancho que la foto cuando está pequeña
    title.style.maxWidth = `${(stage.clientWidth * config.startWidth) / 100}px`;
  }

  // animación suave: "current" persigue a "target" en cada frame
  function tick() {
    const k = config.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * config.smoothing));
    current += (target - current) * k;
    if (Math.abs(target - current) < 0.0004) {
      current = target;
      running = false;
    }
    applyProgress(current);
    raf = running ? requestAnimationFrame(tick) : 0;
  }

  function onScroll() {
    target = readProgress();
    if (reducedMotion) {
      current = target;
      applyProgress(current);
      return;
    }
    if (!running) {
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    }
  }

  function onResize() {
    measure();
    target = readProgress();
    current = target;
    applyProgress(current);
  }

  banner.classList.add("is-scroll-expand"); // activa el estado "recortado" del CSS
  measure();
  target = readProgress();
  current = target;
  applyProgress(current);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("load", onResize); // por si cambian los tamaños al cargar fuentes e imagen


  /* ==========================================================
   * 5) HUMO QUE SIGUE AL CURSOR
   * El motor (simulación de fluidos con WebGL) está en splash-cursor.js.
   * Aquí solo se configura: color, cuánto se ve y cuánto dura la estela.
   * ========================================================== */
  const canvas = document.getElementById("hero-smoke");

  if (canvas && typeof window.createSplashCursor === "function" && !reducedMotion) {
    window.createSplashCursor(canvas, {
      colors: ["#bba9ee"], // morado muy suave
      rainbow: false,
      intensity: 0.3,      // más bajo = más sutil
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
      contained: true,     // solo dentro del banner
      theme: "dark",
    });
  }
})();
