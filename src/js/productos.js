// Lumina · Módulo de productos
// ------------------------------------------------------------
// Carga los productos desde la API del backend y los expone
// para el catálogo, detalle, carrito y otros módulos.
// Reutiliza src/api/services/productos.service.js (Rol B).

import { obtenerTodas } from "../api/services/productos.service.js";

export let productos = [];

try {
    productos = await obtenerTodas();
} catch (error) {
    console.warn("No se pudieron cargar los productos desde el backend:", error);
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
    const encontrada = CATEGORIAS.find(
        categoria => categoria.value === value
    );

    return encontrada ? encontrada.label : value;
}

export function obtenerClaseCategoria(value) {
    const encontrada = CATEGORIAS.find(
        categoria => categoria.value === value
    );

    return encontrada ? encontrada.clase : "category-default";
}

// Cargar productos desde el backend.
async function cargarProductos() {
    window.productosCargando = true;

    try {
        productos = await obtenerTodas();
    } catch (error) {
        console.error(
            "Error cargando productos desde la API:",
            error
        );

        productos = [];
        window.productos = productos;
        window.productosCargando = false;

        window.dispatchEvent(
            new CustomEvent("productos-listadas")
        );

        return;
    }

    productos = Array.isArray(productos) ? productos : [];

    // Fusionar productos creados desde el panel de administración.
    try {
        const productosCreados = JSON.parse(
            localStorage.getItem("lumina-productos") || "[]"
        );

        if (
            Array.isArray(productosCreados) &&
            productosCreados.length > 0
        ) {
            const maxId = productos.reduce(
                (max, producto) =>
                    Math.max(max, Number(producto.id) || 0),
                0
            );

            productosCreados.forEach((producto, index) => {
                if (
                    !producto.id ||
                    productos.some(p => p.id === producto.id)
                ) {
                    producto.id = maxId + index + 1;
                }
            });

            productos.push(...productosCreados);
        }
    } catch (error) {
        console.warn(
            "No se pudieron cargar los productos creados desde el admin:",
            error
        );
    }

    // Exponer productos y funciones globales utilizadas por otros módulos.
    window.productos = productos;
    window.obtenerClaseCategoria = obtenerClaseCategoria;
    window.obtenerLabelCategoria = obtenerLabelCategoria;

    // Notificar que los productos ya están disponibles.
    window.productosCargando = false;

    window.dispatchEvent(
        new CustomEvent("productos-listadas")
    );
}

// Exponer funciones globales utilizadas por otros módulos.
window.obtenerClaseCategoria = obtenerClaseCategoria;
window.obtenerLabelCategoria = obtenerLabelCategoria;

cargarProductos();
