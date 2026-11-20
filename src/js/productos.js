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

export function obtenerClaseCategoria(categoria) {
  const categorias = {
    "Amor propio": "category-amor-propio",
    "Mindfulness": "category-mindfulness",
    "Intencion": "category-intencion",
    "Intención": "category-intencion",
    "Descanso": "category-descanso",
    "Bienestar": "category-bienestar",
    "Halloween": "category-halloween",
    "Navidad": "category-navidad",
    "Rituales": "category-rituales"
  };

  return categorias[categoria] || "category-default";
}

window.productos = productos;
window.obtenerClaseCategoria = obtenerClaseCategoria;

// Notifica a los demás módulos que el catálogo de productos ya está disponible.
window.dispatchEvent(new CustomEvent("productos-listadas"));
