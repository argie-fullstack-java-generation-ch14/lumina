// Lumina · ui
// Utilidades para inyectar componentes compartidos (header y footer) y, en la
// home, el contenido de cada página dentro de su sección.
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

function resolveModulePaths(container, path) {
  if (!container) return;
  const base = new URL(path, APP_BASE);

  ["src", "href"].forEach((attribute) => {
    container.querySelectorAll(`[${attribute}]`).forEach((element) => {
      const value = element.getAttribute(attribute);
      if (!value || /^([a-z]+:|\/\/|#|\/)/i.test(value)) return;
      element.setAttribute(attribute, new URL(value, base).href);
    });
  });
}

function injectStyles(doc, path) {
  const base = new URL(path, APP_BASE).href;

  doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const absolute = new URL(href, base).href;
    const alreadyLoaded = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'))
      .some((existing) => existing.href === absolute);
    if (alreadyLoaded) return;

    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = absolute;
    document.head.appendChild(style);
  });
}

function injectScripts(doc, path, force = false) {
  const base = new URL(path, APP_BASE).href;

  doc.querySelectorAll("script[src]").forEach((script) => {
    const src = script.getAttribute("src");
    if (!src) return;

    const absolute = new URL(src, base).href;

    if (force) {
      const existing = document.querySelector(`script[src="${absolute}"]`);
      if (existing) existing.remove();
    } else {
      const alreadyLoaded = Array.from(document.querySelectorAll("script[src]"))
        .some((existing) => existing.src === absolute);
      if (alreadyLoaded) return;
    }

    const element = document.createElement("script");
    Array.from(script.attributes).forEach((attribute) => {
      if (attribute.name === "src") return;
      element.setAttribute(attribute.name, attribute.value);
    });
    element.src = absolute;
    element.async = false;
    document.body.appendChild(element);
  });
}

function applyMainAttributes(container, main) {
  if (!container || !main) return;
  main.classList.forEach((cls) => container.classList.add(cls));
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

function initBootstrapComponents(container) {
  if (!container || typeof bootstrap === "undefined") return;
  container.querySelectorAll('[data-bs-ride="carousel"]').forEach((carousel) => {
    bootstrap.Carousel.getOrCreateInstance(carousel);
  });
}

async function renderSection(selector, path, options = {}) {
  const container = document.querySelector(selector);
  if (!container) return;

  try {
    const html = await fetchPage(path);
    const doc = new DOMParser().parseFromString(html, "text/html");

    injectStyles(doc, path);

    const main = doc.querySelector("main");
    if (main) applyMainAttributes(container, main);
    container.innerHTML = main ? main.innerHTML : doc.body.innerHTML;

    resolveModulePaths(container, path);
    injectScripts(doc, path, options.forceScripts);
    initBootstrapComponents(container);
  } catch (error) {
    container.innerHTML = '<div class="alert alert-danger">No se pudo cargar el contenido.</div>';
    console.error(error);
  }
}
