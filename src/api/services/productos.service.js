// Lumina · Servicio de Productos
// ------------------------------------------------------------
// Capa de API para el catálogo de productos.
// Reutiliza src/api/client.js y src/api/endpoints.js.

import { apiGet, apiPost, apiPut, apiDelete } from "../client.js";
import { endpoints } from "../endpoints.js";

function getToken() {
    return localStorage.getItem("token") || undefined;
}

/**
 * Obtiene todos los productos.
 * GET /api/productos
 */
export async function obtenerTodas() {
    return apiGet(endpoints.productos.all);
}

/**
 * Obtiene un producto por su ID.
 * GET /api/productos/{id}
 */
export async function obtenerPorId(id) {
    return apiGet(endpoints.productos.byId(id));
}

/**
 * Obtiene un producto por su slug.
 * GET /api/productos/slug/{slug}
 */
export async function obtenerPorSlug(slug) {
    return apiGet(endpoints.productos.bySlug(slug));
}

/**
 * Obtiene productos filtrados por categoría.
 * GET /api/productos?categoria={categoria}
 */
export async function obtenerPorCategoria(categoria) {
    return apiGet(endpoints.productos.byCategory(categoria));
}

/**
 * Obtiene solo los productos disponibles.
 * GET /api/productos?disponibles=true
 */
export async function obtenerDisponibles() {
    return apiGet(endpoints.productos.available);
}

/**
 * Crea un nuevo producto (requiere rol ADMIN).
 * POST /api/productos
 */
export async function crearProducto(data) {
    return apiPost(endpoints.productos.all, data, getToken());
}

/**
 * Actualiza un producto existente (requiere rol ADMIN).
 * PUT /api/productos/{id}
 */
export async function actualizarProducto(id, data) {
    return apiPut(endpoints.productos.byId(id), data, getToken());
}

/**
 * Elimina un producto (requiere rol ADMIN).
 * DELETE /api/productos/{id}
 */
export async function eliminarProducto(id) {
    return apiDelete(endpoints.productos.byId(id), getToken());
}

export default {
    obtenerTodas,
    obtenerPorId,
    obtenerPorSlug,
    obtenerPorCategoria,
    obtenerDisponibles,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
};
