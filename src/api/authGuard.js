/**
 * Lumina AuthGuard
 * Utilidad para proteger rutas/vistas del frontend contra acceso no autorizado.
 * Lee el token y los datos del usuario desde localStorage.
 */

export function requireAuth(rolesPermitidos = []) {
  const token = localStorage.getItem("token");
  const usuarioRaw = localStorage.getItem("usuarioActivo");

  // 1. Verificar que exista token
  if (!token) {
    window.location.href = "/src/tienda/login/index.html";
    return false;
  }

  // 2. Verificar que exista usuario
  if (!usuarioRaw) {
    localStorage.removeItem("token");
    window.location.href = "/src/tienda/login/index.html";
    return false;
  }

  let usuario;
  try {
    usuario = JSON.parse(usuarioRaw);
  } catch (error) {
    console.error("Error parseando usuarioActivo:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioActivo");
    window.location.href = "/src/tienda/login/index.html";
    return false;
  }

  // 3. Verificar rol
  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.role)) {
    window.location.href = "/src/tienda/login/index.html";
    return false;
  }

  return true;
}
