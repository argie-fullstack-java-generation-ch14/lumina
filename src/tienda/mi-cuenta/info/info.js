// Lumina - Información de la cuenta

function cargarInformacionCuenta() {

  // Obtener los campos del formulario
  const nombre = document.getElementById("info-nombre");
  const email = document.getElementById("info-email");
  const telefono = document.getElementById("info-telefono");
  const password = document.getElementById("info-password");

  // Obtener el botón y el icono de contraseña
  const togglePassword = document.getElementById("toggle-password");
  const passwordEye = document.getElementById("password-eye");

  // Verificar que los elementos existan
  if (!nombre || !email || !telefono || !password) {
    console.error("No se encontraron los campos de información.");
    return;
  }

  // Recuperar los datos del usuario
  let usuario = null;

  try {
    usuario = JSON.parse(
      localStorage.getItem("usuarioActivo") || "null"
    );
  } catch (error) {
    console.error("Error al recuperar los datos:", error);
  }

  // Verificar si existe un usuario activo
  if (!usuario) {
    nombre.value = "";
    email.value = "";
    telefono.value = "";
    password.value = "";
    return;
  }

  // Mostrar información del usuario
  nombre.value = usuario.nombreCompleto || "";
  email.value = usuario.email || "";
  telefono.value = usuario.telefono || "";
  password.value = usuario.contrasena || "";

  // Mostrar u ocultar contraseña
  if (togglePassword && passwordEye) {

    togglePassword.addEventListener("click", () => {

      const mostrar = password.type === "password";

      // Cambiar el tipo del campo
      password.type = mostrar ? "text" : "password";

      // Cambiar el icono
      passwordEye.classList.toggle("ri-eye-line", !mostrar);
      passwordEye.classList.toggle("ri-eye-off-line", mostrar);

      // Actualizar accesibilidad
      togglePassword.setAttribute(
        "aria-label",
        mostrar ? "Ocultar contraseña" : "Mostrar contraseña"
      );

      togglePassword.title = mostrar
        ? "Ocultar contraseña"
        : "Mostrar contraseña";

    });

  }

}