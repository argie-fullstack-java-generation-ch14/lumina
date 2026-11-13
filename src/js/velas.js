const response = await fetch(new URL("../data/velas.json", import.meta.url));
export const velas = await response.json();

// Fusionar productos creados desde el panel de admin (guardados en localStorage)
try {
  const productosCreados = JSON.parse(localStorage.getItem("lumina-productos") || "[]");

  if (Array.isArray(productosCreados) && productosCreados.length > 0) {
    const maxId = velas.reduce((max, vela) => Math.max(max, Number(vela.id) || 0), 0);

    productosCreados.forEach((producto, index) => {
      // Evitar colisiones de ID con el JSON y entre productos creados
      if (!producto.id || velas.some((v) => v.id === producto.id)) {
        producto.id = maxId + index + 1;
      }
    });

    velas.push(...productosCreados);
  }
} catch (error) {
  console.warn("No se pudieron cargar los productos creados desde el admin:", error);
}

export function obtenerClaseCategoria(categoria) {
  const categorias = {
    "Amor propio": "category-amor-propio",
    "Mindfulness": "category-mindfulness",
    "Intencion": "category-intencion",
    "Descanso": "category-descanso",
    "Bienestar": "category-bienestar",
    "Halloween": "category-halloween",
    "Navidad": "category-navidad",
    "Rituales": "category-rituales"
  };

  return categorias[categoria] || "category-default";
}

window.velas = velas;
window.obtenerClaseCategoria = obtenerClaseCategoria;

// Notifica a los demás módulos que el catálogo de velas ya está disponible.
window.dispatchEvent(new CustomEvent("velas-listadas"));
