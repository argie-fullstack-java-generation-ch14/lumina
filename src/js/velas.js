import { productosService } from "../api/services/productos.service.js";

export let velas = [];

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

async function cargarVelas() {
    const respuesta = await productosService.obtenerTodas();

    if (!respuesta.ok) {
        console.error("Error cargando productos:", respuesta.error);
        return;
    }

    velas = respuesta.data;

    window.velas = velas;
    window.obtenerClaseCategoria = obtenerClaseCategoria;

    window.dispatchEvent(new CustomEvent("velas-listadas"));
}

cargarVelas();

window.obtenerClaseCategoria = obtenerClaseCategoria;