/**
 * Lumina AuthGuard
 * Utilidad para proteger rutas/vistas del frontend contra acceso no autorizado.
 * Lee el token y los datos del usuario desde localStorage.
 */

function redirigirALogin() {
  const esAdmin = window.location.pathname.includes("/admin/");
  window.location.href = esAdmin
    ? "/src/admin/login/index.html"
    : "/src/tienda/login/index.html";
}

function tokenExpirado(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
    const payload = JSON.parse(atob(padded));
    if (payload.exp == null) return false;
    return payload.exp * 1000 <= Date.now();
  } catch (error) {
    // Token malformado: se trata como inválido
    return true;
  }
}

export function requireAuth(rolesPermitidos = []) {
  const token = localStorage.getItem("token");
  const usuarioRaw = localStorage.getItem("usuarioActivo");

  // 1. Verificar que exista token
  if (!token) {
    redirigirALogin();
    return false;
  }

  // 2. Verificar que el token no esté vencido
  if (tokenExpirado(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioActivo");
    redirigirALogin();
    return false;
  }

  // 3. Verificar que exista usuario
  if (!usuarioRaw) {
    localStorage.removeItem("token");
    redirigirALogin();
    return false;
  }

  let usuario;
  try {
    usuario = JSON.parse(usuarioRaw);
  } catch (error) {
    console.error("Error parseando usuarioActivo:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioActivo");
    redirigirALogin();
    return false;
  }

  // 4. Verificar rol
  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.role)) {
    redirigirALogin();
    return false;
  }

  return true;
}
