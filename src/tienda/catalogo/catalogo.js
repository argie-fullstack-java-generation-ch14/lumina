/* Lumina - Catalogo de velas */

// Datos de los productos del catalogo.
const catalogo = {
    catalogo: [
        {
            id: 1,
            name: "Renacer",
            slug: "renacer",
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624150/generation/lumina/RENACER_ulhbzr.png",
            scent: "Floral",
            category: "Bienestar",
            weight: 200,
            description: "Un momento para renovar tu energia.",
            price: 12000
        },
        {
            id: 2,
            name: "Relajacion",
            slug: "relajacion",
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624148/generation/lumina/RELAJACION_pr3hrs.png",
            scent: "Lavanda",
            category: "Descanso",
            weight: 200,
            description: "Ideal para desconectarte y descansar.",
            price: 12000
        },
        {
            id: 3,
            name: "Equilibrio",
            slug: "equilibrio",
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624147/generation/lumina/EQUILIBRIO_vdvulk.png",
            scent: "Lavanda - Manzanilla",
            category: "Mindfulness",
            weight: 200,
            description: "Encuentra tu propio centro.",
            price: 12000
        },
        {
            id: 4,
            name: "Luna Nueva",
            slug: "luna-nueva",
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624148/generation/lumina/LUNA_NUEVA_xmjx2p.png",
            scent: "Amaderado",
            category: "Intencion",
            weight: 200,
            description: "Un nuevo comienzo para ti.",
            price: 12000
        },
        {
            id: 5,
            name: "Pausa",
            slug: "pausa",
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624147/generation/lumina/PAUSA_gyci9x.png",
            scent: "Lavanda - Manzanilla",
            category: "Amor propio",
            weight: 200,
            description: "Ideal para desconectarte del ruido del dia y crear un ambiente relajante.",
            price: 12000
        },
        {
            id: 6,
            name: "Conexion",
            slug: "conexion",
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624147/generation/lumina/CONEXION_mpjl1u.png",
            scent: "Dulce",
            category: "Amor propio",
            weight: 200,
            description: "Conecta contigo y con tu esencia.",
            price: 12000
        },
        {
            id: 7,
            name: "Atardecer",
            slug: "atardecer",
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624147/generation/lumina/ATARDECER_jyisey.png",
            scent: "Citrico",
            category: "Bienestar",
            weight: 200,
            description: "Disfruta la tranquilidad del momento.",
            price: 12000
        },
        {
            id: 8,
            name: "Claridad",
            slug: "claridad",
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624147/generation/lumina/CLARIDAD_fx1nsz.png",
            scent: "Herbal",
            category: "Mindfulness",
            weight: 200,
            description: "Crea un espacio para tus ideas.",
            price: 12000
        },
        {
            id: 9,
            name: "Armonia",
            slug: "armonia",
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624147/generation/lumina/ARMONIA_ofbr1l.png",
            scent: "Floral",
            category: "Intencion",
            weight: 200,
            description: "Encuentra armonia en tu espacio.",
            price: 12000
        },
        {
            id: 10,
            name: "Aura",
            slug: "aura",
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624147/generation/lumina/AURA_slwuq8.png",
            scent: "Lavanda - Manzanilla",
            category: "Mindfulness",
            weight: 200,
            description: "Desconecta del ruido y regalate calma.",
            price: 12000
        },

        // Velas de la categoria Navidad.
        {
            id: 11,
            name: "Noche de Paz",
            slug: "noche-de-paz",
            img: "./images/nochedepaz.png",
            scent: "Vainilla",
            category: "Navidad",
            weight: 200,
            description: "Calma que ilumina tu hogar.",
            price: 12000
        },
        {
            id: 12,
            name: "Pinos del Bosque",
            slug: "pinos-del-bosque",
            img: "./images/pinos.png",
            scent: "Pino y cedro",
            category: "Navidad",
            weight: 200,
            description: "Un respiro de naturaleza en tu espacio.",
            price: 12000
        },
        {
            id: 13,
            name: "Magia",
            slug: "magia",
            img: "./images/magia.png",
            scent: "Frutos rojos",
            category: "Navidad",
            weight: 200,
            description: "Pequenos momentos que se sienten grandes.",
            price: 12000
        },
        {
            id: 14,
            name: "Canela Dorada",
            slug: "canela-dorada",
            img: "./images/caneladorada.png",
            scent: "Canela y naranja",
            category: "Navidad",
            weight: 200,
            description: "Tradiciones que abrazan el alma.",
            price: 12000
        },
        {
            id: 15,
            name: "Brillo",
            slug: "brillo",
            img: "./images/brillo.png",
            scent: "Jazmin y ambar",
            category: "Navidad",
            weight: 200,
            description: "Luz para nuevos comienzos.",
            price: 12000
        },
        {
            id: 16,
            name: "Celebracion",
            slug: "celebracion",
            img: "./images/celebracion.png",
            scent: "Naranja y canela",
            category: "Navidad",
            weight: 200,
            description: "Aromas que reunen lo mas importante.",
            price: 12000
        }
    ]
};


// Obtener la clase de color de cada categoria.
function obtenerClaseCategoria(categoria) {
    const categorias = {
        "Amor propio": "category-amor-propio",
        "Mindfulness": "category-mindfulness",
        "Intencion": "category-intencion",
        "Descanso": "category-descanso",
        "Bienestar": "category-bienestar",
        "Halloween": "category-halloween",
        "Navidad": "category-navidad",
        "Rituales": "category-rituales"
    };

    return categorias[categoria] || "category-default";
}


// Crear la tarjeta de una vela.
function crearVela(vela) {
    const claseCategoria = obtenerClaseCategoria(vela.category);

    return `
        <article class="candle-card">

            <a
                class="candle-link"
                href="producto/index.html?slug=${encodeURIComponent(vela.slug)}"
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


// Mostrar las seis velas navidenas en Favoritas de temporada.
const contenedorFavoritas = document.getElementById(
    "favorites-container"
);

const velasNavidad = catalogo.catalogo.filter(
    vela => vela.category === "Navidad"
);

if (contenedorFavoritas) {
    contenedorFavoritas.innerHTML = velasNavidad
        .map(crearVela)
        .join("");
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

    contenedorCatalogo.innerHTML = productosFiltrados
        .map(crearVela)
        .join("");

    if (contadorProductos) {
        contadorProductos.textContent =
            `${productosFiltrados.length} velas encontradas`;
    }

    if (mensajeVacio) {
        mensajeVacio.hidden = productosFiltrados.length > 0;
    }
}


// Mostrar el catalogo completo al cargar la pagina.
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