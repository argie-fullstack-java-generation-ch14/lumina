// Lumina · Servicios de Pedidos
// ------------------------------------------------------------
// Capa de API para gestión de pedidos.
// Reutiliza src/api/client.js y src/api/endpoints.js (creados en Rol A).

import { apiPost, apiGet, apiPut } from "../client.js";
import { endpoints } from "../endpoints.js";

/**
 * Crea un nuevo pedido.
 * POST /api/pedidos
 */
export async function crearPedido(data) {
  return apiPost(endpoints.pedidos.all, data);
}

/**
 * Obtiene los pedidos de un usuario.
 * GET /api/pedidos?usuarioId={usuarioId}
 */
export async function listarPedidosPorUsuario(usuarioId) {
  return apiGet(endpoints.pedidos.byUsuario(usuarioId));
}

/**
 * Actualiza el estado de un pedido.
 * PUT /api/pedidos/{id}/estado
 */
export async function actualizarEstado(id, estado) {
  return apiPut(endpoints.pedidos.updateStatus(id), { status: estado });
}

export default {
  crearPedido,
  listarPedidosPorUsuario,
  actualizarEstado,
};
