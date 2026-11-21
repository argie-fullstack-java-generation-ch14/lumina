// Lumina · Registro · Backend
// ------------------------------------------------------------
// Comunicación con la API para crear cuenta de usuario.

import { apiPost } from "../../api/client.js";
import { endpoints } from "../../api/endpoints.js";

export async function registerUser(userData) {
  const response = await apiPost(endpoints.auth.register, {
    fullName: userData.fullName,
    phone: userData.phone,
    email: userData.email,
    password: userData.password,
  });

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
