// Lumina - Información de la cuenta

function cargarInformacionCuenta() {

  // Obtener los campos del formulario
  const nombre = document.getElementById("info-nombre");
  const email = document.getElementById("info-email");
  const telefono = document.getElementById("info-telefono");

  // Verificar que los elementos existan
  if (!nombre || !email || !telefono) {
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
    return;
  }

  // Mostrar información del usuario
  nombre.value = usuario.fullName || "";
  email.value = usuario.email || "";
  telefono.value = usuario.phone || "";

}