const response = await fetch(new URL("../data/velas.json", import.meta.url));
export const velas = await response.json();

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
