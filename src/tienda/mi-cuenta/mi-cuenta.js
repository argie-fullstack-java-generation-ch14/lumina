fetch('info/index.html')
  .then(res => {
    if (!res.ok) {
      throw new Error("No se pudo cargar información de la cuenta");
    }

    return res.text();
  })
  .then(html => {

    document.getElementById('info-content').innerHTML = html;

    // Cargar JavaScript de información de la cuenta
    const script = document.createElement('script');
    script.src = 'info/info.js';

    script.onload = () => {
      if (typeof cargarInformacionCuenta === 'function') {
        cargarInformacionCuenta();
      }
    };

    script.onerror = () => {
      console.error('Error cargando info.js');
    };

    document.body.appendChild(script);

  })
  .catch(err => {
    console.error('Error cargando módulo de info:', err);
  });

// Cargar módulo de pedidos
fetch('pedidos/index.html')
  .then(res => {
    if (!res.ok) {
      throw new Error("No se pudo cargar pedidos");
    }

    return res.text();
  })
  .then(html => {
    document.getElementById('pedidos-content').innerHTML = html;
  })
  .catch(err => {
    console.error('Error cargando módulo de pedidos:', err);
  });

// Cargar módulo de favoritos
fetch('favoritos/index.html')
  .then(res => {
    if (!res.ok) {
      throw new Error("No se pudo cargar favoritos");
    }

    return res.text();
  })
  .then(html => {

    document.getElementById('favoritos-content').innerHTML = html;

    if (typeof renderFavoritos === 'function') {
      if (window.velas) {
        renderFavoritos();
      } else {
        window.addEventListener('velas-listadas', renderFavoritos, { once: true });
      }
    }

  })
  .catch(err => {
    console.error('Error cargando módulo de favoritos:', err);
  });

// Actualizar burbuja del carrito
function actualizarBurbujaCarrito() {

  if (typeof refrescarBurbujaCarrito === "function") {
    refrescarBurbujaCarrito();
  }

}

if (document.getElementById("cart-count")) {

  actualizarBurbujaCarrito();

} else {

  const observer = new MutationObserver(() => {

    const badge = document.getElementById("cart-count");

    if (badge) {
      observer.disconnect();
      actualizarBurbujaCarrito();
    }

  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

}
