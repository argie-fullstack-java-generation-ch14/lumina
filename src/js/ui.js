// Lumina · ui
// Utilidades para inyectar componentes compartidos (header y footer).
// Requiere servir el sitio por HTTP: fetch() no funciona con file://.

const APP_BASE = (() => {
  const script = document.currentScript;
  if (!script || !script.src) return "./";
  return new URL("../", script.src).href;
})();

const COMPONENTS_BASE = new URL("componentes/", APP_BASE).href;

async function fetchPage(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Error ${response.status} al cargar ${path}`);
  }
  return await response.text();
}

function resolveLinks(container) {
  if (!container) return;
  container.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    link.href = new URL(href, APP_BASE).href;
  });
  container.querySelectorAll("img[src]").forEach((img) => {
    const src = img.getAttribute("src");
    if (!src || /^([a-z]+:|\/\/|\/|#)/i.test(src)) return;
    img.setAttribute("src", new URL(src, APP_BASE).href);
  });
}

async function renderPartial(selector, name) {
  const container = document.querySelector(selector);
  if (!container) return;

  try {
    container.innerHTML = await fetchPage(COMPONENTS_BASE + name);
    resolveLinks(container);
  } catch (error) {
    console.error(error);
  }
}
