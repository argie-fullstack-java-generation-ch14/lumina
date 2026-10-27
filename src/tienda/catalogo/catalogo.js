
/* Lumina - Catalogo de velas */

// Carpeta de este script: resuelve rutas correctamente
// en su propia pagina y cuando se inyecta en la home.
const CATALOGO_DIR = new URL(".", document.currentScript.src).href;
const PRODUCTO_URL = new URL("producto/", CATALOGO_DIR).href;

// Datos de los productos del catalogo.
const catalogo = {
    catalogo: [
        {
            id: 1,
            name: "Renacer",
            slug: "renacer",
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624150/generation/lumina/catalogo/RENACER_ulhbzr.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624148/generation/lumina/catalogo/RELAJACION_pr3hrs.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624147/generation/lumina/catalogo/EQUILIBRIO_vdvulk.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624148/generation/lumina/catalogo/LUNA_NUEVA_xmjx2p.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624147/generation/lumina/catalogo/PAUSA_gyci9x.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624147/generation/lumina/catalogo/CONEXION_mpjl1u.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624147/generation/lumina/catalogo/ATARDECER_jyisey.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624147/generation/lumina/catalogo/CLARIDAD_fx1nsz.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624147/generation/lumina/catalogo/ARMONIA_ofbr1l.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792624147/generation/lumina/catalogo/AURA_slwuq8.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792899666/generation/lumina/catalogo/NAVIDAD/NOCHE_DE_PAZ_kco6mt.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792899667/generation/lumina/catalogo/NAVIDAD/PINOS_DEL_BOSQUE_jnep5t.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792899666/generation/lumina/catalogo/NAVIDAD/MAGIA_qkngud.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792899666/generation/lumina/catalogo/NAVIDAD/CANELA_DORADA_ncvwlo.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792899665/generation/lumina/catalogo/NAVIDAD/BRILLO_vamisc.png",
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
            img: "https://res.cloudinary.com/dvvwfb2tr/image/upload/v1792899666/generation/lumina/catalogo/NAVIDAD/CELEBRACIO%CC%81N_mt1hkf.png",
            scent: "Naranja y canela",
            category: "Navidad",
            weight: 200,
            description: "Aromas que reunen lo mas importante.",
            price: 12000
        },
        {
            id: 17,
            name: "Noche de Brujas",
            slug: "noche-de-brujas",
            img: "https://res.cloudinary.com/zj7mojiw/image/upload/v1793039456/13.png",
            scent: "Vainilla oscura, sándalo y ámbar",
            category: "Halloween",
            weight: 200,
            description: "Un toque de misterio para iluminar tus noches.",
            price: 12000
        },
        {
            id: 18,
            name: "Calabaza Dorada",
            slug: "calabaza-dorada",
            img: "https://res.cloudinary.com/zj7mojiw/image/upload/v1793039457/12.png",
            scent: "Calabaza especiada, canela y naranja",
            category: "Halloween",
            weight: 200,
            description: "Calidez y dulzura para abrazar tus momentos favoritos.",
            price: 12000
        },
        {
            id: 19,
            name: "Hechizo de Luna",
            slug: "hechizo-de-luna",
            img: "https://res.cloudinary.com/zj7mojiw/image/upload/v1793039460/11.png",
            scent: "Lavanda, cedro y hierbas aromáticas",
            category: "Halloween",
            weight: 200,
            description: "Una pausa mágica para reconectar contigo misma.",
            price: 12000
        },
        {
            id: 20,
            name: "Rosa de Medianoche",
            slug: "rosa-de-medianoche",
            img: "https://res.cloudinary.com/zj7mojiw/image/upload/v1793039460/10.png",
            scent: "Rosa, frutos rojos y pachulí",
            category: "Halloween",
            weight: 200,
            description: "Un aroma misterioso para celebrar tu esencia.",
            price: 12000
        },
        {
            id: 21,
            name: "Bosque Encantado",
            slug: "bosque-encantado",
            img: "https://res.cloudinary.com/zj7mojiw/image/upload/v1793039456/9.png",
            scent: "Pino, cedro y tierra húmeda",
            category: "Halloween",
            weight: 200,
            description: "Un respiro de naturaleza en medio de la magia.",
            price: 12000
        },
        {
            id: 22,
            name: "Último Suspiro",
            slug: "ultimo-suspiro",
            img: "https://res.cloudinary.com/zj7mojiw/image/upload/v1793039460/8.png",
            scent: "Incienso, vainilla y madera ahumada",
            category: "Halloween",
            weight: 200,
            description: "Suelta lo que pesa y enciende la luz de un nuevo comienzo.",
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


// Mostrar las velas navidenas en Favoritas de temporada.
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
