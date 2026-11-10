// Lumina · registro
// Solo esta página.

function initRegisterForm() {
  const form = document.querySelector('#register-form');
  const alertBox = document.querySelector('#register-alert');
  const layout = document.querySelector('#register-layout');
  const done = document.querySelector('#register-done');
  const doneTitle = document.querySelector('#register-done-title');
  const submitButton = document.querySelector('#register-submit');
  const starsCanvas = document.querySelector('#register-stars');

  const nameInput = document.querySelector('#register-name');
  const phoneInput = document.querySelector('#register-phone');
  const emailInput = document.querySelector('#register-email');
  const passwordInput = document.querySelector('#register-password');
  const confirmInput = document.querySelector('#register-confirm');

  const usersKey = 'usuarios';
  const successText = 'Registro exitoso, ahora eres parte de Lumina';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let triedToSend = false;

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(usersKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem(usersKey, JSON.stringify(users));
  }

  function emailExists(email) {
    return getUsers().some((user) => user.email === email);
  }

  function cleanPhone(value) {
    let phone = value.replace(/[\s()-]/g, '');
    if (phone.startsWith('+57')) {
      phone = phone.slice(3);
    }
    return phone;
  }

  function validateName(value) {
    const name = value.trim();
    if (name === '') {
      return 'Escribe tu nombre completo.';
    }
    if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(name)) {
      return 'El nombre solo puede tener letras y espacios.';
    }
    if (name.split(/\s+/).length < 2) {
      return 'Escribe tu nombre y tu apellido.';
    }
    return '';
  }

  function validatePhone(value) {
    if (value.trim() === '') {
      return 'Escribe tu número de teléfono.';
    }
    if (!/^3\d{9}$/.test(cleanPhone(value))) {
      return 'El teléfono debe tener 10 números y empezar por 3, por ejemplo 300 123 4567.';
    }
    return '';
  }

  function validateEmail(value) {
    const email = value.trim().toLowerCase();
    if (email === '') {
      return 'Escribe tu correo electrónico.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return 'Escribe un correo válido, por ejemplo nombre@correo.com.';
    }
    if (emailExists(email)) {
      return 'Ese correo ya está registrado. Usa otro correo.';
    }
    return '';
  }

  function validatePassword(value) {
    if (value === '') {
      return 'Escribe una contraseña.';
    }
    if (value.length < 8) {
      return 'La contraseña debe tener mínimo 8 caracteres.';
    }
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
      return 'La contraseña debe tener letras y números.';
    }
    return '';
  }

  function validateConfirm(value) {
    if (value === '') {
      return 'Confirma tu contraseña.';
    }
    if (value !== passwordInput.value) {
      return 'Las contraseñas no coinciden.';
    }
    return '';
  }

  const fields = [
    { input: nameInput, validate: validateName },
    { input: phoneInput, validate: validatePhone },
    { input: emailInput, validate: validateEmail },
    { input: passwordInput, validate: validatePassword },
    { input: confirmInput, validate: validateConfirm }
  ];

  function getErrors() {
    const errors = [];
    fields.forEach((field) => {
      const message = field.validate(field.input.value);
      if (message !== '') {
        errors.push({ input: field.input, message: message });
      }
    });
    return errors;
  }

  function markFields(errors) {
    fields.forEach((field) => {
      const hasError = errors.some((error) => error.input === field.input);
      field.input.closest('.register-field').classList.toggle('has-error', hasError);
      field.input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
    });
  }

  function showAlert(errors) {
    if (errors.length === 0) {
      alertBox.innerHTML = '';
      return;
    }

    const items = errors.map((error) => '<li>' + error.message + '</li>').join('');
    alertBox.innerHTML =
      '<div class="alert alert-danger alert-dismissible" role="alert">' +
      '<strong>Revisa estos datos:</strong>' +
      '<ul class="mb-0 mt-2">' + items + '</ul>' +
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>' +
      '</div>';
  }

  function createUser() {
    return {
      nombreCompleto: nameInput.value.trim().replace(/\s+/g, ' '),
      telefono: cleanPhone(phoneInput.value),
      email: emailInput.value.trim().toLowerCase(),
      contrasena: passwordInput.value
    };
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let smoke = null;
  const stars = createStars(starsCanvas);

  if (typeof window.createSplashCursor === 'function' && !reducedMotion) {
    const smokeCanvas = document.createElement('canvas');
    smokeCanvas.className = 'page-smoke';
    smokeCanvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(smokeCanvas);

    smoke = window.createSplashCursor(smokeCanvas, {
      colors: ['#8f78d9'],
      rainbow: false,
      intensity: 0.2,
      size: 1.1,
      force: 0.8,
      swirl: 3,
      trail: 1.3,
      momentum: 1.2,
      shading: 0.5,
      glow: 0,
      quality: 'medium',
      clickSplash: false,
      intro: false,
      contained: false,
      theme: 'light'
    });
  }

  function showSuccessText() {
    doneTitle.textContent = '';
    doneTitle.setAttribute('aria-label', successText);

    let index = 0;
    successText.split(' ').forEach((word) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'register-word';
      wordSpan.setAttribute('aria-hidden', 'true');

      for (const letter of word) {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'register-letter';
        letterSpan.style.setProperty('--i', index);
        letterSpan.textContent = letter;
        wordSpan.appendChild(letterSpan);
        index++;
      }

      doneTitle.appendChild(wordSpan);
      doneTitle.appendChild(document.createTextNode(' '));
      index++;
    });

    done.hidden = false;
    doneTitle.focus();
  }

  async function playEnding() {
    const box = submitButton.getBoundingClientRect();
    if (smoke) {
      smoke.splash(box.left + box.width / 2, box.top + box.height / 2);
    }

    if (reducedMotion) {
      layout.hidden = true;
      showSuccessText();
      return;
    }

    layout.classList.add('is-leaving');
    await wait(900);
    layout.hidden = true;
    window.scrollTo(0, 0);

    stars.start();
    await wait(3000);
    await stars.fadeOut();

    showSuccessText();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    triedToSend = true;

    const errors = getErrors();
    markFields(errors);
    showAlert(errors);

    if (errors.length > 0) {
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      errors[0].input.focus({ preventScroll: true });
      return;
    }

    const user = createUser();
    saveUser(user);
    console.log(JSON.stringify(user, null, 2));

    submitButton.disabled = true;
    form.reset();
    playEnding();
  });

  fields.forEach((field) => {
    field.input.addEventListener('input', () => {
      if (!triedToSend) {
        return;
      }
      const errors = getErrors();
      markFields(errors);
      if (alertBox.children.length > 0) {
        showAlert(errors);
      }
    });
  });
}

initRegisterForm();


// Mostrar y ocultar contraseñas
document.querySelectorAll(".register-password-toggle").forEach((button) => {

  button.addEventListener("click", () => {

    const input = document.getElementById(button.dataset.target);
    const icon = button.querySelector("i");

    const mostrar = input.type === "password";

    input.type = mostrar ? "text" : "password";

    icon.classList.toggle("fa-eye", !mostrar);
    icon.classList.toggle("fa-eye-slash", mostrar);

    button.setAttribute(
      "aria-label",
      mostrar ? "Ocultar contraseña" : "Mostrar contraseña"
    );

  });

});
