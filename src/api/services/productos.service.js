import { api } from "../client.js";
import { endpoints } from "../endpoints.js";

export const productosService = {

    async obtenerTodas() {
        try {
            const data = await api.get(endpoints.productos.all);
            return { ok: true, data, error: null };
        } catch (error) {
            return { ok: false, data: null, error: error.message };
        }
    },

    async obtenerPorId(id) {
        try {
            const data = await api.get(endpoints.productos.byId(id));
            return { ok: true, data, error: null };
        } catch (error) {
            return { ok: false, data: null, error: error.message };
        }
    },

    async obtenerPorSlug(slug) {
        try {
            const data = await api.get(endpoints.productos.bySlug(slug));
            return { ok: true, data, error: null };
        } catch (error) {
            return { ok: false, data: null, error: error.message };
        }
    },

    async obtenerPorCategoria(categoria) {
        try {
            const data = await api.get(
                `${endpoints.productos.all}?categoria=${encodeURIComponent(categoria)}`
            );
            return { ok: true, data, error: null };
        } catch (error) {
            return { ok: false, data: null, error: error.message };
        }
    },

    async obtenerDisponibles() {
        try {
            const data = await api.get(
                `${endpoints.productos.all}?disponibles=true`
            );
            return { ok: true, data, error: null };
        } catch (error) {
            return { ok: false, data: null, error: error.message };
        }
    }
};