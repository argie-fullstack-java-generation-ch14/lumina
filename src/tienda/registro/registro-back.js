// Lumina · Registro · Backend
// ------------------------------------------------------------
// Comunicación con la API para crear cuenta de usuario.
// Reutiliza src/api/services/usuarios.service.js (Rol C / usuarios.service).

import { registrar } from "../../api/services/usuarios.service.js";

export async function registerUser(userData) {
  const response = await registrar(userData);

  // Guardar usuario autenticado (sin contraseña)
  localStorage.setItem(
    "usuarioActivo",
    JSON.stringify({
      id: response.id,
      fullName: response.fullName,
      phone: response.phone,
      email: response.email,
      role: response.role,
    })
  );

  return response;
}

export function redirectByRole(role) {
  if (role === "ADMIN" || role === "STAFF") {
    window.location.href = "../../admin/productos/";
  } else {
    window.location.href = "../mi-cuenta/index.html";
  }
}
