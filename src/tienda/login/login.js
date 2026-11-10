
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#login-form");
  const emailInput = document.querySelector("#login-email");
  const passwordInput = document.querySelector("#login-password");
  const alertBox = document.querySelector("#login-alert");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    const users = JSON.parse(localStorage.getItem("usuarios")) || [];

    const user = users.find((item) =>
      item.email === email && item.contrasena === password
    );

    if (!user) {
      alertBox.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Correo o contraseña incorrectos.
        </div>
      `;
      return;
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(user));

    window.location.href = "../mi-cuenta/index.html";
  });
});
