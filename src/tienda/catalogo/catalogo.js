
/* Lumina - Catalogo de velas */

// Carpeta de este script: resuelve rutas correctamente
// en su propia pagina y cuando se inyecta en la home.
const CATALOGO_DIR = new URL(".", document.currentScript.src).href;
const PRODUCTO_URL = new URL("producto/", CATALOGO_DIR).href;

// Datos de los productos del catalogo: viven en js/velas.js, que se carga
// antes de este script (misma estructura de datos para el carrusel de la
// home y el modulo de favoritas de temporada).
const catalogo = { catalogo: velas };


// Crear la tarjeta de una vela.
function crearVela(vela) {
    const claseCategoria = obtenerClaseCategoria(vela.category);

    return `
        <article class="candle-card">

            <a
                class="candle-link"
                href="${PRODUCTO_URL}?slug=${encodeURIComponent(vela.slug)}"
                aria-label="Ver detalles de ${vela.name}">

                <img
                    class="candle-image"
                    src="${vela.img}"
                    alt="Vela Lumina ${vela.name}"
                    loading="lazy"
                >

            </a>

            <button
                class="favorite-button"
                type="button"
                aria-label="Agregar ${vela.name} a favoritos"
                aria-pressed="false">

                <i class="fa-regular fa-heart"
                   aria-hidden="true"></i>

            </button>

            <div class="candle-content">

                <div class="candle-heading">
                    <h3>${vela.name}</h3>

                    <span class="candle-category ${claseCategoria}">
                        ${vela.category}
                    </span>
                </div>

                <div class="candle-details">

                    <span class="candle-scent">
                        <i class="fa-solid fa-bottle-droplet"
                           aria-hidden="true"></i>
                        ${vela.scent}
                    </span>

                    <span class="candle-weight">
                        ${vela.weight}g
                    </span>

                </div>

                <p class="candle-description">
                    ${vela.description}
                </p>

                <div class="candle-purchase">
                    <p class="candle-price">
                        $ ${vela.price.toLocaleString("es-CO")}
                    </p>

                    <button
                        class="add-to-cart"
                        type="button"
                        aria-label="Agregar ${vela.name} al carrito">
                        Agregar al carrito
                    </button>
                </div>

            </div>

        </article>
    `;
}


// Referencias a los elementos del catalogo.
const contenedorCatalogo = document.getElementById(
    "catalog-container"
);

const contadorProductos = document.getElementById(
    "products-count"
);

const mensajeVacio = document.getElementById(
    "empty-results"
);

const botonLimpiar = document.getElementById(
    "clear-filters"
);

const selectorOrden = document.getElementById(
    "sort-products"
);


// Detectar si el catálogo está dentro de la página principal.
const esPaginaPrincipal =
    document.body.dataset.page === "home";


// Aplicar filtros y ordenamiento.
function actualizarCatalogo() {
    if (!contenedorCatalogo) {
        return;
    }

    const categoriasSeleccionadas = Array.from(
        document.querySelectorAll(
            'input[name="category"]:checked'
        )
    ).map(input => input.value.toLowerCase());

    const aromasSeleccionados = Array.from(
        document.querySelectorAll(
            'input[name="scent"]:checked'
        )
    ).map(input => input.value.toLowerCase());

    let productosFiltrados = catalogo.catalogo.filter(vela => {
        const categoria = vela.category.toLowerCase();
        const aroma = vela.scent.toLowerCase();

        const coincideCategoria =
            categoriasSeleccionadas.length === 0 ||
            categoriasSeleccionadas.some(valor =>
                categoria.includes(valor)
            );

        const coincideAroma =
            aromasSeleccionados.length === 0 ||
            aromasSeleccionados.some(valor =>
                aroma.includes(valor)
            );

        return coincideCategoria && coincideAroma;
    });

    const orden = selectorOrden
        ? selectorOrden.value
        : "default";

    if (orden === "name-asc") {
        productosFiltrados.sort((a, b) =>
            a.name.localeCompare(b.name, "es")
        );
    } else if (orden === "name-desc") {
        productosFiltrados.sort((a, b) =>
            b.name.localeCompare(a.name, "es")
        );
    } else if (orden === "price-asc") {
        productosFiltrados.sort((a, b) =>
            a.price - b.price
        );
    } else if (orden === "price-desc") {
        productosFiltrados.sort((a, b) =>
            b.price - a.price
        );
    }

    // En la pagina principal mostrar solo 8 productos.
    // En las demas paginas mostrar todos los productos filtrados.
    const productosVisibles = esPaginaPrincipal
        ? productosFiltrados.slice(0, 8)
        : productosFiltrados;

    // Mostrar los productos en pantalla.
    contenedorCatalogo.innerHTML = productosVisibles
        .map(crearVela)
        .join("");

    // Actualizar el contador de productos visibles.
    if (contadorProductos) {
        contadorProductos.textContent =
            `${productosVisibles.length} velas encontradas`;
    }

    // Mostrar mensaje si no hay productos.
    if (mensajeVacio) {
        mensajeVacio.hidden = productosVisibles.length > 0;
    }
}


// Mostrar los productos al cargar la pagina.
actualizarCatalogo();


// Escuchar cambios en los filtros.
document.querySelectorAll(
    'input[name="category"], input[name="scent"]'
).forEach(input => {
    input.addEventListener("change", actualizarCatalogo);
});


// Ordenar productos.
if (selectorOrden) {
    selectorOrden.addEventListener(
        "change",
        actualizarCatalogo
    );
}


// Limpiar filtros y restablecer el orden.
if (botonLimpiar) {
    botonLimpiar.addEventListener("click", function () {
        document.querySelectorAll(
            'input[name="category"], input[name="scent"]'
        ).forEach(input => {
            input.checked = false;
        });

        if (selectorOrden) {
            selectorOrden.value = "default";
        }

        actualizarCatalogo();
    });
}


// Activar o desactivar el corazon de favoritos.
document.addEventListener("click", function (evento) {
    const boton = evento.target.closest(".favorite-button");

    if (!boton) {
        return;
    }

    const icono = boton.querySelector("i");

    const esFavorito =
        boton.getAttribute("aria-pressed") === "true";

    boton.setAttribute(
        "aria-pressed",
        String(!esFavorito)
    );

    boton.setAttribute(
        "aria-label",
        esFavorito
            ? "Agregar a favoritos"
            : "Quitar de favoritos"
    );

    icono.classList.toggle("fa-regular", esFavorito);
    icono.classList.toggle("fa-solid", !esFavorito);
});
