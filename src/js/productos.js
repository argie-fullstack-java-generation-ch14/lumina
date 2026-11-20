export let productos = [];

try {
  const response = await fetch(new URL("../data/productos.json", import.meta.url));
  productos = await response.json();
} catch (error) {
  console.warn("No se pudieron cargar los productos desde productos.json:", error);
  productos = [];
}

// Fusionar productos creados desde el panel de admin (guardados en localStorage)
try {
  const productosCreados = JSON.parse(localStorage.getItem("lumina-productos") || "[]");

  if (Array.isArray(productosCreados) && productosCreados.length > 0) {
    const maxId = productos.reduce((max, producto) => Math.max(max, Number(producto.id) || 0), 0);

    productosCreados.forEach((producto, index) => {
      if (!producto.id || productos.some((p) => p.id === producto.id)) {
        producto.id = maxId + index + 1;
      }
    });

    productos.push(...productosCreados);
  }
} catch (error) {
  console.warn("No se pudieron cargar los productos creados desde el admin:", error);
}

export const CATEGORIAS = [
  { value: "bienestar", label: "Bienestar", clase: "category-bienestar" },
  { value: "descanso", label: "Descanso", clase: "category-descanso" },
  { value: "mindfulness", label: "Mindfulness", clase: "category-mindfulness" },
  { value: "intencion", label: "Intención", clase: "category-intencion" },
  { value: "amor-propio", label: "Amor propio", clase: "category-amor-propio" },
  { value: "halloween", label: "Halloween", clase: "category-halloween" },
  { value: "navidad", label: "Navidad", clase: "category-navidad" },
  { value: "rituales", label: "Rituales", clase: "category-rituales" },
];

export function obtenerLabelCategoria(value) {
  const encontrada = CATEGORIAS.find((categoria) => categoria.value === value);
  return encontrada ? encontrada.label : value;
}

export function obtenerClaseCategoria(value) {
  const encontrada = CATEGORIAS.find((categoria) => categoria.value === value);
  return encontrada ? encontrada.clase : "category-default";
}

window.productos = productos;
window.obtenerClaseCategoria = obtenerClaseCategoria;
window.obtenerLabelCategoria = obtenerLabelCategoria;

// Notifica a los demás módulos que el catálogo de productos ya está disponible.
window.dispatchEvent(new CustomEvent("productos-listadas"));
