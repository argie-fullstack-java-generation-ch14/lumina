
/* Lumina - Catalogo de velas */

// Carpeta de este script: resuelve rutas correctamente
// en su propia pagina y cuando se inyecta en la home.
const CATALOGO_DIR = new URL(".", document.currentScript.src).href;
const PRODUCTO_URL = new URL("producto/", CATALOGO_DIR).href;

// El enlace "Explora todo el catálogo" solo tiene sentido cuando el catálogo
// se muestra desde el inicio; en esta misma página se oculta.
// (En la home el catálogo se inyecta pero el pathname es del index raíz.)
// La clase "pagina-catalogo" permite estilos exclusivos cuando la ruta
// contiene "catalogo".
if (location.pathname.includes("catalogo")) {
    document.querySelector(".view-all-link")?.remove();
    document.getElementById("catalogo-completo")?.classList.add("catalogo-margin");
}

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
                data-product-id="${vela.id}"
                aria-label="${esFavorito(vela.id) ? `Quitar ${vela.name} de favoritos` : `Agregar ${vela.name} a favoritos`}"
                aria-pressed="${esFavorito(vela.id)}">

                <i class="fa-${esFavorito(vela.id) ? "solid" : "regular"} fa-heart"
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
                        data-product-id="${vela.id}"
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
    // Reintenta encontrar el contenedor: en la home este script puede
    // ejecutarse antes de que la sección del catálogo se termine de
    // inyectar (el módulo de favoritas de temporada también lo carga),
    // y una captura única con null dejaría el grid vacío hasta recargar.
    const contenedor = contenedorCatalogo ||
        document.getElementById("catalog-container");

    if (!contenedor) {
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
    contenedor.innerHTML = productosVisibles
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


// El corazón de favoritos se maneja globalmente en js/favoritos.js
// (guarda la vela en "lumina-favoritos" y pinta el corazón).

// Agregar productos al carrito desde el catálogo.
document.addEventListener("click", function (evento) {
    const boton = evento.target.closest("#catalog-container .add-to-cart");

    if (!boton) {
        return;
    }

    const idProducto = boton.dataset.productId;

    if (typeof agregarAlCarrito === "function") {
        agregarAlCarrito(idProducto);
    }
});