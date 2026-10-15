// Lumina · contacto
// Solo esta página.
// Formulario de contacto: valida los campos y después los envía con Formspree.

function initContactForm() {
  // Los elementos de la página que voy a usar
  const form = document.querySelector('#contact-form');
  const sending = document.querySelector('#contact-sending');
  const success = document.querySelector('#contact-success');
  const formError = document.querySelector('#contact-form-error');
  const againButton = document.querySelector('#contact-again');

  // El hámster se ve mínimo este tiempo, para que no desaparezca de golpe si el envío es rápido
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const minSendingTime = reducedMotion ? 500 : 2000;

  // Cada función revisa un campo y devuelve el mensaje de error, o '' si está bien
  function validateName(value) {
    if (value === '') {
      return 'Escribe tu nombre.';
    }
    if (value.length < 2) {
      return 'El nombre es muy corto.';
    }
    // solo letras (con tildes), espacios, apóstrofe, punto y guion
    if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(value)) {
      return 'El nombre solo puede tener letras y espacios.';
    }
    return '';
  }

  function validateEmail(value) {
    if (value === '') {
      return 'Escribe tu correo electrónico.';
    }
    // algo@dominio.com
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return 'Escribe un correo válido, por ejemplo nombre@correo.com.';
    }
    return '';
  }

  function validatePhone(value) {
    if (value === '') {
      return 'Escribe tu teléfono.';
    }
    // acepto números, espacios, guiones, paréntesis y un + al inicio
    if (!/^\+?[\d\s()-]+$/.test(value)) {
      return 'El teléfono solo puede tener números, espacios, guiones y el signo +.';
    }
    // quito todo lo que no sea número y cuento los dígitos
    const digits = value.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      return 'El teléfono debe tener entre 7 y 15 números.';
    }
    return '';
  }

  function validateMessage(value) {
    if (value === '') {
      return 'Escribe tu mensaje.';
    }
    if (value.length < 10) {
      return 'El mensaje es muy corto. Cuéntanos un poco más (mínimo 10 caracteres).';
    }
    return '';
  }

  // Cada campo con su función de validación
  const fields = [
    { input: document.querySelector('#contact-name'), validate: validateName },
    { input: document.querySelector('#contact-email'), validate: validateEmail },
    { input: document.querySelector('#contact-phone'), validate: validatePhone },
    { input: document.querySelector('#contact-message'), validate: validateMessage }
  ];

  // Muestra (o borra) el mensaje de error que va debajo del campo
  function showError(input, message) {
    const wrapper = input.closest('.contact-field');
    const errorText = document.querySelector('#' + input.id + '-error');
    errorText.textContent = message;
    wrapper.classList.toggle('has-error', message !== '');
    input.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
  }

  // Revisa un solo campo. Devuelve true si está bien
  function checkField(field) {
    const message = field.validate(field.input.value.trim());
    showError(field.input, message);
    return message === '';
  }

  // Revisa todos los campos. Devuelve true solo si todos están bien
  function checkForm() {
    let firstInvalid = null;
    fields.forEach((field) => {
      const isValid = checkField(field);
      if (!isValid && firstInvalid === null) {
        firstInvalid = field.input;
      }
    });
    // si hay errores, el cursor se va al primer campo malo
    if (firstInvalid !== null) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  // Muestra solo una de las tres vistas: 'form', 'sending' o 'success'
  function showView(name) {
    form.hidden = name !== 'form';
    sending.hidden = name !== 'sending';
    success.hidden = name !== 'success';
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Manda los datos del formulario a Formspree
  async function sendToFormspree() {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) {
      throw new Error('Formspree respondió con el estado ' + response.status);
    }
  }

  form.addEventListener('submit', async (event) => {
    // evito que la página se recargue al enviar
    event.preventDefault();
    formError.textContent = '';

    if (!checkForm()) {
      return;
    }

    // si el action todavía tiene el ID de ejemplo, aviso en vez de enviar
    if (form.action.includes('TU_ID_DE_FORMSPREE')) {
      formError.textContent = 'Falta el ID de Formspree en el atributo action del formulario.';
      return;
    }

    // guardo el primer nombre para el mensaje de gracias
    const firstName = document.querySelector('#contact-name').value.trim().split(' ')[0];

    showView('sending');
    document.querySelector('#contact-sending-title').focus();

    try {
      // espero a que termine el envío y también el tiempo mínimo del hámster
      await Promise.all([sendToFormspree(), wait(minSendingTime)]);
      document.querySelector('#contact-success-text').textContent =
        'Gracias, ' + firstName + '. Recibimos tu mensaje y te escribiremos pronto.';
      form.reset();
      showView('success');
      document.querySelector('#contact-success-title').focus();
    } catch (error) {
      // si falla, vuelvo al formulario con los datos que escribió, para que no tenga que repetirlos
      showView('form');
      formError.textContent = 'No pudimos enviar tu mensaje. Revisa tu conexión e inténtalo de nuevo.';
    }
  });

  // Cuando un campo tiene error, lo vuelvo a revisar mientras la persona lo corrige
  fields.forEach((field) => {
    field.input.addEventListener('input', () => {
      if (field.input.closest('.contact-field').classList.contains('has-error')) {
        checkField(field);
      }
    });
  });

  // Botón "Enviar otro mensaje": vuelve al formulario vacío
  againButton.addEventListener('click', () => {
    showView('form');
    fields[0].input.focus();
  });
}

initContactForm();
