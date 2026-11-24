# Lumina

Tienda de velas personalizadas. Sitio público + panel de administrador.

Fase 1: HTML/CSS/JS sin servidor. Fase 2: API Java/Spring Boot + MySQL.

Este documento es el **modelo de negocio**: qué es Lumina, qué páginas tiene y
qué hace cada una. También documenta las estrategias técnicas que usa el sitio
(ver [Estrategias técnicas del proyecto](#estrategias-técnicas-del-proyecto)).
Para el resto de la parte técnica —estructura de carpetas, CSS, Bootstrap
y reglas del equipo con Git— ver [docs/DESARROLLO.md](docs/DESARROLLO.md).

## Cómo verlo (con Live Server)

El sitio es HTML/CSS/JS puro, pero el header y el footer se inyectan con
`fetch()`, por lo que **no se puede abrir con doble clic en el `.html`**: el
navegador bloquea ese `fetch()` bajo `file://`. Se sirve por HTTP con la
extensión **Live Server** de VS Code.

> ⚠️ **Importante:** en VS Code se debe abrir la **carpeta raíz del repo**
> (`lumina`, la que contiene `README.md` y `src/`), nunca una subcarpeta. De
> ahí dependen las rutas relativas de estilos y scripts; si se sirve desde
> otra carpeta, se obtienen errores `404 Not Found` y la página sin estilos.

### Paso 1 — Descargar el repo

```bash
git clone git@github.com:argie-fullstack-java-generation-ch14/lumina.git
cd lumina
```

### Paso 2 — Abrir la carpeta `lumina` en VS Code

1. Abrir VS Code.
2. **File → Open Folder...** (en algunas versiones el primer menú se llama
   **Code**). Atajo: `Ctrl + K`, `Ctrl + O`.
3. Seleccionar la carpeta **`lumina`** y hacer clic en **Open** / **Abrir**.

**Verificación:** en el explorador de VS Code, en el nivel superior, debe
aparecer:

```
lumina/
├── README.md
├── docs/
└── src/
```

### Paso 3 — Instalar la extensión Live Server

1. **View → Extensions** (atajo: `Ctrl + Shift + X`).
2. Buscar `Live Server`.
3. Instalar.

### Paso 4 — Levantar Live Server desde el index

1. En el explorador, abrir **`src/index.html`**.
2. Clic en **"Go Live"** (extremo inferior derecho de la barra de estado). Si
   el botón no aparece: clic derecho en el archivo → **Open with Live Server**.
3. El navegador se abre solo.

**URL esperada:**

```
http://127.0.0.1:5500/src/index.html
```

Si la URL **no** contiene `/src/` antes del archivo (p. ej.
`/index.html` o `/tienda/...`), se está sirviendo desde una carpeta
intermedia: repetir el Paso 2.

> El puerto puede variar (5500 por defecto; si está ocupado, Live Server usa
> otro). Lo relevante es que la ruta contenga `/src/`.

### Alternativa: npx serve (requiere Node)

Desde la carpeta `lumina` (la raíz del repo):

```bash
npx serve
```

Luego abrir <http://localhost:3000/> y entrar a `src/`, o directamente
<http://localhost:3000/src/>.

> El repo incluye un `serve.json` con `"trailingSlash": true` para que las
> carpetas se sirvan siempre con `/` al final. Sin esa configuración, `serve`
> responde `200` en `/src` sin redirigir, el navegador toma `/src` como base
> y pide los estilos a `/css/...` y `/js/...` (404). Si se trabaja con una
> copia del repo anterior a este archivo, se debe escribir la URL con la
> barra final: `http://localhost:3000/src/`.

## Estrategias técnicas del proyecto

Sin framework ni backend, el proyecto tuvo que resolver a mano varios problemas que en otros proyectos resuelven las librerías. Estas son las estrategias adoptadas, qué problema resuelve cada una y dónde están en el código.

### 1. Componentes reutilizables sin framework

El proyecto no usa ningún framework de front-end (React, Vue, Astro...). Para no repetir código entre páginas, imita dos patrones de componentes reutilizables:

#### Inyección por `fetch()` de HTML externo

El header y el footer se escriben una sola vez, en `src/componentes/header/header.html` y `src/componentes/footer/footer.html`, y se inyectan en cada página con `fetch()` (ver `src/js/ui.js`):

```js
await renderPartial("#header", "header/header.html");
await renderPartial("#footer", "footer/footer.html");
```

La función `renderPartial` (definida en `src/js/ui.js:109`) imita el patrón de **plantillas parciales** (*partials*) que existe en casi todos los entornos web desde hace décadas. Un partial es un fragmento de HTML que se repite en varias páginas —típicamente el header y el footer— y que se mantiene en **un solo archivo**: se escribe una vez y se "incluye" donde hace falta. Si mañana cambia el menú, se edita un archivo y se actualiza todo el sitio; si el markup se copiara y pegara en cada página, habría que editarlo página por página y cada copia sería una oportunidad de que quede desactualizada (el principio **DRY**: *Don't Repeat Yourself*).

El patrón no es invención de ningún framework moderno: es tan viejo como el `include` de PHP, y casi todas las tecnologías lo traen con otro nombre o sintaxis:

| Entorno | Cómo incluye un partial |
|---|---|
| PHP puro | `<?php include 'partials/header.php'; ?>` |
| Laravel (PHP) | Blade: `@include('partials.header')` |
| WordPress (PHP) | `get_header()`, `get_footer()`, `get_template_part('partials/card')` |
| Symfony (PHP) | Twig: `{{ include('partials/header.html.twig') }}` |
| Ruby on Rails | `render partial: "header"` — de aquí viene el nombre "partial" |
| Handlebars | `{{> header }}` |
| EJS | `<%- include('partials/header') %>` |

Lo que cambia entre unos y otros es **quién hace el include**. En PHP, Rails, Blade o Twig lo hace el servidor, antes de enviar la página al navegador: el HTML llega ya armado. Lumina no tiene servidor, así que el include lo hace el navegador: `renderPartial` pide el fragmento con `fetch()`, lo inyecta en el contenedor indicado por el selector (`#header`, `#footer`), resuelve sus rutas relativas para que funcionen desde cualquier página y carga su CSS si aún no está en el `<head>`. Para quien visita el sitio el resultado es el mismo; la diferencia es que el armado ocurre en el navegador y, por eso, exige servir el sitio por HTTP (ver "Cómo verlo").

La misma estrategia se usa en la home (`src/index.html`) para inyectar el contenido de cada módulo dentro de su sección vacía (`#inicio`, `#beneficios`, `#catalogo`, etc.), mediante `renderSection(selector, path)` en `src/js/ui.js`. `renderSection` es la variante para la home: parsea el HTML completo del módulo con `DOMParser`, extrae solo el `<main>`, y además inyecta scripts y reinicializa los componentes de Bootstrap.

Lo que resuelve `ui.js` al inyectar:
- Resuelve rutas relativas de enlaces `<a>` e imágenes respecto a `src/` (`resolveLinks` / `resolveModulePaths`).
- Carga el CSS del componente si aún no está en el `<head>` (deduplicado por URL).
- Carga y ejecuta los `<script>` del componente, evitando cargarlos dos veces.
- Reinicializa los componentes de Bootstrap (carruseles, etc.) después de inyectar.

⚠️ Como usa `fetch()`, el sitio **debe servirse por HTTP**; abrir el HTML con `file://` deja las páginas sin header ni footer.

#### Template strings (componentes con datos dinámicos)

Cuando un componente necesita mostrar datos que vienen de un JSON (y no solo markup estático), se usa un módulo ES que expone una función que devuelve HTML como *template string*, y la página lo pinta con `innerHTML`.

Ejemplos:
- `src/componentes/blog-card/blog-card.js` → `crearBlogCard(articulo)` devuelve el HTML de una tarjeta de artículo.
- `src/componentes/productos-recomendados/productos-recomendados.js` → `crearSeccionRecomendados(velas)` devuelve el HTML completo (título + cards en scroll horizontal) usando `.map().join("")`.
- `src/componentes/carrusel/carrusel.js` → template strings para montar el carrusel.
- `src/componentes/carrito/item-carrito/item-carrito.js` y `src/componentes/favoritos/item-favoritos/item-favoritos.js` → el HTML de una fila del carrito o de la lista de favoritos a partir del producto.

Ejemplo en `src/tienda/blog/blog.js`: primero trae `articulos.json`, luego llama a `crearBlogCard(articulo)` y asigna el resultado al `innerHTML` del contenedor.

#### Cuándo usar cada técnica

| Estrategia | Cuándo usarla | Dónde vive |
|---|---|---|
| `fetch()` + HTML externo | Markup compartido entre páginas (header, footer, secciones de la home) | `src/componentes/` con `.html`, inyectado desde `src/js/ui.js` |
| Template strings | Componentes que reciben datos dinámicos (JSON) | `src/componentes/` con `.js`, importado por la página o auto-montado (ej. `productos-recomendados.js`) |

Estas dos técnicas resuelven el **reuso de markup**. Las estrategias siguientes cubren lo que el proyecto también resolvió a mano: la carga y sincronización del catálogo, las rutas entre páginas anidadas, el enrutado de vistas de detalle, el rendimiento de la home y la confiabilidad de los datos persistentes.

### 2. Evento `velas-listadas` — sincronizar scripts sin depender de su orden

El catálogo (`src/js/velas.js`) es un módulo ES con top-level `await`: el navegador lo ejecuta de forma diferida, cuando termina de descargar `velas.json`. En cambio, sus consumidores (`carrito.js`, `favoritos.js`, `productos-recomendados.js`...) son scripts clásicos que corren de inmediato y no pueden saber si el catálogo ya está disponible cuando arrancan.

La solución: `velas.js` publica el catálogo en `window.velas` y anuncia que está listo con un `CustomEvent`:

```js
// src/js/velas.js:19-23
window.velas = velas;
window.dispatchEvent(new CustomEvent("velas-listadas"));
```

Cada consumidor se registra con el mismo patrón:

```js
// ej. src/js/carrito.js:78-82
if (window.velas) {
  initCarrito();
} else {
  window.addEventListener("velas-listadas", initCarrito, { once: true });
}
```

Es un mini event-bus hecho a mano: **un emisor** (`velas.js`) y **suscriptores** que se auto-registran con `{ once: true }`. Consecuencia práctica: cada página puede incluir los `<script>` en el orden que sea sin romper nada, y ningún consumidor necesita saber dónde está el `<script>` de `velas.js` respecto al suyo.

- Emisor: `src/js/velas.js:19-23`.
- Suscriptores: `src/js/carrito.js:78-82`, `src/js/favoritos.js:61-64`, `src/componentes/productos-recomendados/productos-recomendados.js:111-116`, `src/tienda/catalogo/favoritos-de-temporada/favoritos-de-temporada.js:13-16`.

### 3. Un solo módulo de datos con top-level `await`

El catálogo no se pide desde cada página ni desde cada componente: existe **una única capa de datos**, `src/js/velas.js`. Al ser un módulo ES puede usar `await` en el nivel superior: el navegador no ejecuta lo que depende de él hasta que el JSON llegó.

```js
// src/js/velas.js:1-2
const response = await fetch(new URL("../data/velas.json", import.meta.url));
export const velas = await response.json();
```

Ese mismo módulo hace las tres cosas: carga el JSON **una sola vez** por visita (un solo `fetch` a `velas.json`, sin importar cuántas páginas o componentes consuman el catálogo), lo exporta como única fuente de verdad (`import { velas } from "../../js/velas.js"`, como hace `catalogo.js:9`) y lo publica en `window.velas` para los scripts clásicos que no pueden hacer `import` (que es lo que hace posible el event bus de la estrategia 2).

Consecuencia práctica: la ruta del JSON (`data/velas.json`) vive en **un solo archivo**. Ningún consumidor sabe dónde está el JSON ni cómo se carga; solo saben que pueden leer `velas`.

### 4. Rutas ancladas al script, no a la página

Los mismos scripts corren en páginas anidadas a distinta profundidad: `src/index.html`, `src/tienda/carrito/index.html`, `src/tienda/catalogo/producto/index.html`. Si un script resolviera sus rutas contra la página actual (`location.href`), cada página daría un resultado distinto.

La solución: cada script calcula su base a partir de **su propia URL** —`document.currentScript.src` en los scripts clásicos, `import.meta.url` en los módulos ES— y de ahí deriva URLs absolutas que son las mismas desde cualquier página:

```js
// src/js/carrito.js:20-23 (script clásico)
const CARRITO_URL = new URL(
  "../tienda/carrito/index.html",
  new URL(".", document.currentScript.src).href
).href;

// src/tienda/blog/blog.js:3-5 (módulo ES)
const BLOG_DIR = new URL(".", import.meta.url).href;
export const ARTICULO_URL = new URL("articulo/", BLOG_DIR).href;
```

Otros ejemplos: `src/js/ui.js:6-12` (`APP_BASE` → `COMPONENTS_BASE`), `src/tienda/catalogo/catalogo.js:6-7` (`CATALOGO_DIR` → `PRODUCTO_URL`).

El complemento está en la inyección: cuando `ui.js` inyecta HTML traído con `fetch()`, reescribe los enlaces e imágenes relativos del fragmento (`resolveLinks` / `resolveModulePaths`, `ui.js:22-47`) para que también apunten al lugar correcto. Resultado: los enlaces se escriben una vez, relativos a la carpeta del script, y funcionan desde cualquier página del sitio.

### 5. Detalle por query param: una plantilla HTML + un JSON

Para tener N artículos de blog no hace falta N archivos HTML ni un enrutador: una sola **página plantilla** (`src/tienda/blog/articulo/index.html`) sirve a todos. Su módulo (`articulo.js`) lee el identificador de la URL, resuelve el contenido contra el JSON y renderiza:

- `articulo.js:10-12` — lee `?slug=` con `URLSearchParams`.
- `articulo.js:14-17` — trae `data/articulos.json` (ruta construida con la base del módulo, estrategia 4).
- `init()` en `articulo.js:70-93` — tres estados: sin slug → "no encontrado"; slug inexistente → "no encontrado"; slug válido → renderiza el artículo y actualiza `document.title`.

Los enlaces que apuntan al detalle se construyen con `encodeURIComponent` para que el slug viaje seguro en la URL: `catalogo.js:36` (cards del catálogo → `producto/?slug=...`) y `carrusel.js:152-155` (cards del carrusel).

> Nota sobre el detalle de **producto** (`src/tienda/catalogo/producto/`): la **navegación** ya funciona con el mismo patrón — los enlaces del catálogo y del carrusel ya apuntan a `producto/?slug=...` — pero la página todavía no consume el slug: `producto.js` está vacío y el HTML tiene bloques wireframe con TODO. Pendiente: que `producto.js` lea el `?slug=`, resuelva la vela contra el catálogo y renderice imagen, info y precio, igual que hace `articulo.js` con los artículos.

### 6. Preload del CSS de la home (truco *loadCSS*)

La home inyecta el contenido de 6 secciones con `renderSection`, y cada sección (y el header, el footer y el carrusel) trae su propio CSS. Si ese CSS solo se cargara al inyectar — cuando `ui.js` añade el `<link>` después del `fetch()` — la home mostraría un instante de contenido sin estilos (*FOUC*).

La solución está declarada en el `<head>` de `src/index.html:19-27`, con el truco clásico *loadCSS*:

```html
<link rel="preload" href="tienda/inicio/inicio.css" as="style"
      onload="this.rel='stylesheet'">
```

Dos fases en una línea:
- `rel="preload" as="style"`: el navegador descarga el CSS con prioridad alta **sin bloquear el render** ni aplicarlo.
- `onload="this.rel='stylesheet'"`: al terminar la descarga, el propio `<link>` cambia su `rel` y el CSS se aplica.

Es decir, el CSS de cada sección ya está (o casi) en el navegador cuando `renderSection` inyecta su HTML, que viaja por `fetch()` por separado. El resultado: la home con 6 secciones inyectadas no se queda en blanco ni parpadea. Por si el CSS llegara dos veces, `ui.js` deduplica por URL absoluta antes de añadir `<link>` (`injectStyles`, `ui.js:49-66`).

### 7. localStorage como entrada no confiable

El carrito y los favoritos viven en `localStorage`, que es texto editable por cualquiera (el usuario, otra pestaña, una extensión). Tratarlo como fuente confiable rompería la página con un JSON corrupto o inyectaría productos fantasma que ya no existen en el catálogo.

Por eso, al cargar (`src/js/carrito.js:32-61`), el contenido nunca se usa tal cual: se valida y normaliza de arriba abajo.

```js
// src/js/carrito.js:40-55 (resumen)
const datos = JSON.parse(carritoGuardado);        // dentro de try/catch
if (!Array.isArray(datos)) return [];              // debe ser un array

return datos
  .filter(item =>
    velas.some(vela => vela.id === Number(item.id)) &&   // el producto existe en el catálogo
    Number.isInteger(Number(item.quantity)) &&
    Number(item.quantity) > 0                            // cantidad entera y positiva
  )
  .map(item => ({
    id: Number(item.id),
    quantity: Math.min(99, Number(item.quantity))        // tope de cantidad
  }));
```

Si algo falla —JSON roto, formato inesperado— se devuelve un carrito vacío y la página renderiza normal. `favoritos.js` aplica la misma normalización sobre su clave.

Claves del ecosistema: `lumina-carrito`, `lumina-favoritos`, `usuarios`, `usuarioActivo`. Todas temporales: en Fase 2 pasan a la API (ver "Dos fases de arquitectura").

### 8. Carrusel infinito sin librería

`src/componentes/carrusel/carrusel.js` implementa a mano lo que un carrusel de librería da gratis:

- **Loop infinito** duplicando la pista (`base + base`, `:223-229`), midiendo el ciclo con `offsetLeft` y repitiendo hasta llenar el ancho visible (tope 8 repeticiones, `:231-235`).
- **Wrap del scroll**: al pasar el ciclo, `scrollLeft` retrocede un ciclo completo (`:106-110`) — visualmente infinito, con scroll nativo.
- **Drag vs click**: las cards navegan al detalle, pero solo con un toque real. Con un `WeakMap` se guarda dónde empezó el `pointerdown` y en el `click` se compara: si el dedo se movió más de 6px o cambió el `scrollLeft`, fue un arrastre y no navega (`:112-156`).
- **Autoplay respetuoso**: `setInterval` que se pausa al hacer hover y que no corre si el usuario tiene `prefers-reduced-motion` activado (`:164+`).
- **Idempotente**: un flag (`pista.dataset.carruselListo`, `:100-104`) evita duplicar listeners si el carrusel se re-monta.

## Mapa de navegación

### Sitio público

**`Menú`** en la columna "Desde" no es una página: es el Header / Navbar, el
componente que se repite en todas las páginas. Da acceso directo a Inicio
(el logo), Catálogo, Nosotros, Blog, Contáctanos, Carrito, Favoritos y Usuario.

La entrada de Usuario es condicional: **sin sesión muestra `Login`, con sesión
muestra el área de cuenta (`Mi cuenta`)**.

| Sección | Archivo | Desde |
|---|---|---|
| Inicio | `src/tienda/inicio/index.html` | Menú |
| Catálogo | `src/tienda/catalogo/index.html` | Menú |
| Detalle de producto | `src/tienda/catalogo/producto/index.html?slug=<slug-de-la-vela>` | Inicio, Catálogo |
| Crea tu vela | `src/tienda/crear/index.html` | Aún sin enlace: se abre por URL (el creador paso a paso está en construcción) |
| Carrito | `src/tienda/carrito/index.html` | Menú |
| Nosotros | `src/tienda/nosotros/index.html` | Menú |
| Blog | `src/tienda/blog/index.html` | Menú |
| Artículo del blog | `src/tienda/blog/articulo/index.html?slug=<slug-del-articulo>` | Blog |
| Contáctanos | `src/tienda/contacto/index.html` | Menú |
| Login | `src/tienda/login/index.html` | Menú (sin sesión) |
| Registro | `src/tienda/registro/index.html` | Login |
| Favoritos | `src/tienda/favoritos/index.html` | Menú |
| Recuperar contraseña | *(sin implementar aún)* | Login |
| Mi cuenta | `src/tienda/mi-cuenta/index.html` | Menú (con sesión) — área con pestañas: Información, Favoritos, Pedidos |
| Información (pestaña) | `src/tienda/mi-cuenta/info/index.html` | Mi cuenta |
| Favoritos (pestaña) | `src/tienda/mi-cuenta/favoritos/index.html` | Mi cuenta |
| Pedidos (pestaña) | `src/tienda/mi-cuenta/pedidos/index.html` | Mi cuenta |

Las tres pestañas de Mi cuenta no se navegan como páginas: `mi-cuenta/index.html`
las trae con `fetch()` y las inyecta dentro del área de pestañas.

### Acciones dentro de una página (no son páginas)

| Acción | Ocurre en |
|---|---|
| Agregar al carrito | Cards del catálogo, cards del carrusel, productos recomendados y lista de favoritos (`src/js/carrito.js` y sus componentes) |
| Editar cantidad / eliminar | `src/tienda/carrito/index.html` |
| Confirmar pedido (modal) | `src/tienda/carrito/index.html` |

### Panel admin

| Sección | Archivo |
|---|---|
| Gestión de productos | `src/admin/productos/index.html` |
| Crear / actualizar producto (modal) | `src/admin/producto-formulario/modal.html` |

El panel de administración y los pedidos del admin son secciones pendientes de
construir: hoy la administración es solo la gestión de productos.

## Dos fases de arquitectura

### Fase 1 — la que hay ahora

HTML/CSS/JS sin build. El carrito y los pedidos viven en `localStorage`.
Funciona al abrir el archivo, pero no hay backend: los datos no sobreviven a
otro navegador ni a otra máquina.

### Fase 2 — la fase final

- Base de datos **MySQL** con entidades y relaciones.
- API RESTful en **Java / Spring Boot**.
- Autenticación real para restringir el panel de admin.
- El catálogo consume la API con `GET` y `POST` en lugar de un array local.

**Qué cambia al pasar a fase 2:** el carrito deja de leer `localStorage` y pasa a
llamar endpoints. El resto del frontend no se toca.

## Fuera de alcance

- Pasarela de pagos con tarjetas en tiempo real. El checkout solo genera una
  **solicitud de confirmación**, no cobra.
- Envíos con geolocalización o rastreo de guía.
- App móvil nativa (iOS/Android).

## Wizard "Crea tu vela"

Los 5 pasos son un flujo dentro de `src/tienda/crea-tu-vela/index.html`, no 5 archivos HTML:

```
intención → aroma → color/diseño → mensaje → vista previa → agregar al carrito
```

Las intenciones disponibles: amor, calma, abundancia, bienestar y nuevos
comienzos.

## Contenido por página

| Página | Contenido mínimo |
|---|---|
| Inicio | Presentación, banner con propuesta de valor, productos destacados, sección "Crea tu vela", intenciones, beneficios, acceso a catálogo y a login |
| Carrito | Productos con cantidad, subtotal y total; modificar cantidad y eliminar; **estado vacío ("carrito vacío")**; modal de confirmación de pedido |
| Nosotros | Historia, misión, visión, valores, compromiso con el bienestar, materiales biodegradables, filosofía |
| Contacto | Formulario: nombre, correo, asunto, mensaje + datos de contacto + redes |
| Login | Formulario de autenticación + enlace al registro |
| Registro | Formulario de creación de cuenta con animación de bienvenida al completar |
| Favoritos | Lista de productos favoritos y botón para vaciar favoritos |
| Mi cuenta | Área de cuenta con pestañas: Información de la cuenta, Favoritos y Pedidos |

## Catálogo

Cada tarjeta de producto lleva: imagen, nombre, aroma, precio, disponibilidad,
botón de ver detalle y opción de agregar al carrito.

Los filtros (categoría, aroma, precio, color), el orden por precio o novedad y
la paginación funcionan con JavaScript, porque no hay servidor que consulten.
