// Lumina · Servicios de Usuarios
// ------------------------------------------------------------
// Capa de API para autenticación y gestión de usuarios.
// Reutiliza src/api/client.js y src/api/endpoints.js (creados en Rol A).

import { apiPost, apiGet, apiPut } from "../client.js";
import { endpoints } from "../endpoints.js";

/**
 * Registra un nuevo usuario.
 * POST /api/registro
 */
export async function registrar(data) {
  return apiPost(endpoints.auth.register, {
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    password: data.password,
  });
}

/**
 * Inicia sesión de usuario.
 * POST /api/login
 */
export async function login(data) {
  return apiPost(endpoints.auth.login, {
    email: data.email,
    password: data.password,
  });
}

/**
 * Obtiene un usuario por su ID.
 * GET /api/usuarios/{id}
 */
export async function obtenerUsuario(id) {
  return apiGet(endpoints.usuarios.byId(id));
}

/**
 * Actualiza un usuario existente.
 * PUT /api/usuarios/{id}
 */
export async function actualizarUsuario(id, data) {
  return apiPut(endpoints.usuarios.byId(id), data);
}

export default {
  registrar,
  login,
  obtenerUsuario,
  actualizarUsuario,
};
