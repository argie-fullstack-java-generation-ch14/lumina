import { apiPost } from "../../../api/client.js";
import { endpoints } from "../../../api/endpoints.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#login-form");
  const emailInput = document.querySelector("#login-email");
  const passwordInput = document.querySelector("#login-password");
  const alertBox = document.querySelector("#login-alert");
  const togglePassword = document.querySelector("#toggle-password");

  // Mostrar u ocultar contraseña
  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    togglePassword.setAttribute(
      "aria-label",
      isPassword ? "Ocultar contraseña" : "Mostrar contraseña"
    );

    togglePassword.setAttribute("aria-pressed", String(isPassword));
  });

  // Iniciar sesión
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    try {
      const data = await apiPost(endpoints.auth.login, { email, password });

      // Verificar que el usuario tenga rol de administrador o staff
      if (data.user.role !== "ADMIN" && data.user.role !== "STAFF") {
        alertBox.innerHTML = `
          <div class="alert alert-danger" role="alert">
            No tienes permiso para acceder al panel de administración.
          </div>
        `;
        return;
      }

      // Guardar token y datos públicos del usuario (sin contraseña)
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "usuarioActivo",
        JSON.stringify({
          id: data.user.id,
          fullName: data.user.fullName,
          phone: data.user.phone,
          email: data.user.email,
          role: data.user.role
        })
      );

      // Redireccionar al panel de administración
      window.location.href = "productos/index.html";
    } catch (error) {
      alertBox.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Correo o contraseña incorrectos.
        </div>
      `;
      console.error("Error de login:", error);
    }
  });
});
