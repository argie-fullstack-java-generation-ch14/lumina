# Desarrollo
Guía técnica del equipo: cómo está organizado el proyecto, cómo se carga el CSS
y el JavaScript, cómo se instala Bootstrap y cómo trabajar con Git.

El modelo de negocio (qué es Lumina y qué hace cada página) está en el
[README.md](../README.md), en la raíz del repositorio.

El tablero del equipo, donde se asignan las tareas y se lleva el seguimiento del
proyecto, está en [Trello — Lumina](https://trello.com/b/NQBY1NXR/lumina).

‼️ El flujo de integración de cambios es por **Pull Requests**, el flujo detallado está en [INTEGRACION.md](INTEGRACION.md)

No hay build ni dependencias, no hay package.json, no hay npm install, no hay que compilar. Se abren los HTML directo en el navegador.

## Reglas para un desarrollo ordenado

**Cada regla es un enlace.** Al hacer clic te lleva a la explicación completa.

**Cada persona trabaja en su propia página.**

1. [Nadie edita el HTML de una página que no se le haya asignado.](#una-persona-una-pagina)
2. [Nadie edita el CSS de una página que no se le haya asignado.](#una-persona-una-pagina)
3. [Nadie edita el JS de una página que no se le haya asignado.](#una-persona-una-pagina)

**Cada hoja de estilos tiene un único dueño.**

4. [`main.css` y `components.css` los edita **una sola persona por vez**](#git-reglas-para-reducir-conflictos-de-merge). Luego de decidir el diseño y colores, estos archivos serán los primeros a editar antes de comenzar a trabajar en cualquier rama para que cuando estas otras ramas se creen  ya cuenten con estos estilos compartidos, evitando duplicar estilos.
5. [Antes de tocar un archivo compartido, avisa en el chat y espera el visto bueno, por favor.](#git-reglas-para-reducir-conflictos-de-merge)
6. [Los archivos compartidos son estos cinco, y hay que avisar antes de editarlos.](#archivos-compartidos)
   - **CSS:** `css/main.css` y `css/components.css`
   - **JS:** `js/main.js`, `js/carrito.js` y `js/auth.js`

   Bootstrap (`css/bootstrap.min.css` y `js/bootstrap.bundle.min.js`) también es
   de todos, pero **no se toca**.

**Cómo escribir los estilos.**

7. [Los estilos (clases) que se usan en **dos o más** páginas, van en `main.css` o `components.css`.](#que-selector-va-en-cada-archivo)
8. [Las clases creadas para **una página en específico** (ejemplo: `.about-section`), van en el CSS correspondiente a esa página, no en `main.css` o `components.css`.](#que-selector-va-en-cada-archivo)

   Nota: estos estilos no se tocan sin consultar o avisar antes.
9. [No copiar ninguna de las clases  de los archivos `main.css` o `components.css`, si quieres usar una clase de ahí solo se la agregas al elemento HTML donde la necesites aplicar en tu página.](#que-selector-va-en-cada-archivo)

   Nota: esto es para evitar que tus estilos pisen los de la página completa.
   Recordar lo de la especificidad de CSS.

**Los estilos van sobre clases nunca sobre las etiquetas HTML.**

10. [Los estilos se ponen **siempre sobre clases** (`.my-class`), nunca directamente sobre las etiquetas HTML.](#los-estilos-van-sobre-clases-no-sobre-etiquetas)
11. [Si se encuentra algo como `main { ... }` o `body { ... }`, **no se acepta el merge a `main`**.](#los-estilos-van-sobre-clases-no-sobre-etiquetas)

**El código va en inglés. Las rutas, en español.**

12. [Los nombres de las clases CSS van en **inglés** y en **kebab-case**: minúsculas, sin espacios y separadas por guiones. Ejemplos: `.product-card`, `.cart-row`, `.primary-button`.](#los-estilos-van-sobre-clases-no-sobre-etiquetas)
13. [Los nombres de las carpetas y los archivos van en **español**. El código (clases, variables, funciones) va en **inglés**.](#convencion-de-idioma)

**Los archivos de imagen y assets van en español y en kebab-case.**

14. [Los archivos de imagen y assets (`.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`, `.gif`) van en **español** y en **kebab-case**. Ni mayúsculas, ni espacios, ni guiones bajos, ni números sueltos.](#convencion-de-nombres-de-archivos)
15. [En las rutas y carpetas no se usan mayúsculas, se usan kebab-case. Ejemplos: `crea-tu-vela`, `sobre-nosotros`, `panel-admin`.](#convencion-de-nombres-de-archivos)

**La sangría son 2 espacios.**

16. [La indentación del código son **2 espacios**, en HTML, CSS y JavaScript. Nunca tabulaciones.](#indentacion-sangria)

**Git.**

17. [`git pull` antes de empezar, `git push` al terminar, y **nunca** `git push --force` sobre `main`.](#flujo-diario)
18. [Si dos personas necesitan el mismo archivo compartido al mismo tiempo, la segunda espera a que la primera haga `pull` y `push`, o trabaja en una rama aparte.](#ramas-y-commits)
19. [Toda rama se llama `iniciales/nombre-pagina`, todo en minúsculas, se agregan las iniciales del integrante separado con un slash (/) y se agrega el nombre de ka pagina o feature que se le asignó separado con guiones. Ejemplos: `arr/sobre-nosotros`, `psq/carrito-compras`, `mcb/catalogo`.](#como-se-nombran-nuestras-ramas)
20. [Todo commit empieza con un prefijo: `feat:`, `fix:`, `docs:`, `style:` o `refactor:`.](#prefijos-de-los-commits)

Si alguna vez una regla estorba, se avisa al equipo y se cambia aquí. No se salta por cuenta propia.

<a id="una-persona-una-pagina"></a>

## Una persona, una página

**No editar una página que no se te haya asignado:**

- No la abras para cambiarle el estilo.
- No la abras "solo para ver" y guardes sin querer.
- No copies su contenido a tu página para imitar el resultado, se crea el riesgo de pisar los estilos de otras paginas.

**⚠️ IMPORTANTE**

Si necesitas algo de otra página, **pídeselo a quien la tiene**. No la toques tú. Priorizar la comunicacion, esto es crucial en el trabajo en equipo, lo acordamos en el contrato social.

Estas tres reglas son la base de todo lo demás. Si cada quien trabaja en su propia página, dos personas nunca modifican el mismo archivo y Git no tiene nada que reconciliar.

Antes de empezar, el equipo acuerda qué página le toca a cada quien:

| Integrante | Página asignada | Archivos que edita |
|---|---|---|
| Argie Rincón Rodríguez | Nosotros | `tienda/nosotros/index.html`, `tienda/nosotros/nosotros.css`, `tienda/nosotros/nosotros.js` |
| Pedro Sarabia Quispe | Carrito | `tienda/carrito/index.html`, `tienda/carrito/carrito.css`, `tienda/carrito/carrito.js` |
| María Camila Berríos | Catálogo | `tienda/catalogo/index.html`, `tienda/catalogo/catalogo.css`, `tienda/catalogo/catalogo.js` |

- Las tareas de cada página se crean en el [tablero de Trello](https://trello.com/b/NQBY1NXR/lumina)
y se mueven de columna según su estado.
- Cada tarea corresponde a una rama.

## Estructura

Cada página es un **módulo**: una carpeta con su nombre de ruta que contiene sus
propios tres archivos. Es el mismo criterio que usa React, pero sin React.

```
.
├── .gitignore          # raíz del repo, junto a src/
├── .editorconfig       # formato del código: 2 espacios, LF, UTF-8
├── docs/               # documentación del equipo
│   ├── DESARROLLO.md   # esta guía
│   └── INTEGRACION.md  # flujo de Pull Requests
└── src/
    ├── tienda/                 # todas las páginas públicas cuelgan aquí
    │   ├── inicio/             # ruta /tienda/inicio/
    │   │   ├── index.html      # el HTML de la página
    │   │   ├── inicio.css     # sus estilos
    │   │   └── inicio.js      # su JavaScript
    │   ├── catalogo/
    │   │   ├── index.html
    │   │   ├── catalogo.css
    │   │   └── catalogo.js
    │   ├── producto/
    │   ├── crea-tu-vela/
    │   ├── carrito/
    │   ├── nosotros/
    │   ├── contacto/
    │   ├── login/
    │   ├── registro/
    │   ├── recuperar-contrasena/
    │   ├── perfil/
    │   └── pedidos/
    ├── admin/                  # el panel de administración va aparte, con su prefijo
    │   ├── panel/
    │   │   ├── index.html
    │   │   ├── panel.css
    │   │   └── panel.js
    │   ├── productos/
    │   ├── producto-formulario/
    │   └── pedidos/
    ├── css/
    │   ├── bootstrap.min.css   # de Bootstrap, NO se edita
    │   ├── main.css            # global: variables, tipografía, layout
    │   └── components.css      # global: header, footer, botones, cards, forms, modal
    ├── js/
    │   ├── bootstrap.bundle.min.js  # de Bootstrap, NO se edita
    │   ├── main.js             # global: init, menú, footer
    │   ├── carrito.js          # global: carrito en localStorage
    │   └── auth.js             # global: estado de usuario
    └── assets/                 # compartido entre todas las páginas
        ├── img/
        ├── fonts/
        └── icons/
```

El `README.md` vive en la raíz del repositorio, junto a `.gitignore`, porque es
la puerta de entrada del proyecto.

Cuatro cosas a tener en cuenta:

1. **El HTML siempre se llama `index.html`** para que la carpeta sea la ruta. Así el navegador muestra `/tienda/nosotros/` y no `/nosotros.html`.
2. **El CSS y el JS sí llevan el nombre de la carpeta**: `tienda/nosotros/` tiene `nosotros.css` y `nosotros.js`. Así, cuando ves un archivo suelto en las herramientas del navegador o en el explorador de archivos, sabes de qué página
   es sin tener que adivinar. Con 16 módulos, 16 archivos llamados `index.js` no
   dicen nada.
3. **Todo lo público vive bajo `tienda/`**, así queda claro qué es la tienda y qué
   es la parte interna. `tienda/producto/` es el detalle de producto.
4. **El panel de administración queda bajo `admin/`** para poder protegerlo con autenticación más
   adelante, y no se mezcla con `tienda/`.

Se referencian con ruta corta, porque el CSS y el JS de la página están en la
misma carpeta que el HTML:

```html
<!-- dentro de tienda/nosotros/index.html -->
<link rel="stylesheet" href="nosotros.css">
<script src="nosotros.js"></script>
```

Y si el nombre tiene guiones, se respeta tal cual: `tienda/crea-tu-vela/` usa
`crea-tu-vela.css` y `crea-tu-vela.js`.

`assets/` y `css/` viven una sola vez en la raíz: el logo, el favicon y las
fotos de producto se usan tanto en el catálogo como en el panel.

### Qué arquitectura es esta

No hay un patrón con nombre propio, pero este proyecto usa **tres** que juntos
sí tienen nombre en la industria.

**Aplicación multipágina (MPA) + colocación por módulo + rutas por carpetas.**

*Cada carpeta es una página, la carpeta es su URL, y la página
trae sus archivos pegados.*

#### 1. Las rutas salen de las carpetas — *file-based routing*

Existe `tienda/login/index.html` y, por tanto, existe la página `/tienda/login/`.
Nadie configura un archivo de rutas porque la carpeta **es** la ruta. Esa es la
idea central, y no es una invención nuestra: es lo que hacen casi todos los
frameworks modernos.

#### 2. Cada módulo tiene sus archivos juntos — *colocación*

De la palabra inglesa *colocate*, lo que se usa junto, se guarda junto. El CSS y
el JS de una página viven en la carpeta de esa página, no en un `css/` gigante
con todo mezclado. Esa es la palabra técnica que hay que retener, porque es la
que usan los frameworks.

#### 3. Los módulos se agrupan por dominio — *bounded contexts*

`tienda/` y `admin/` no son carpetas arbitrarias, son dos mundos con reglas
distintas. El público no necesita autenticación; el panel de administración sí. En el backend esto
se llama *contexto acotado* y es la base del diseño por dominio (DDD). Acá se
aplica solo a las carpetas, pero el razonamiento es el mismo.

### Por qué se armó así

No fue una decisión estética. Es la estructura que menos problemas da cuando
cinco personas que están aprendiendo editan el mismo repo al mismo tiempo.

| Problema típico | Cómo lo resuelve esta estructura |
|---|---|
| "Alguien editó `css/main.css` y generó conflictos que tomaron mas horas resolver que la tarea que fue asignada" | Casi nadie toca `main.css`: cada quien tiene su CSS. Los archivos compartidos son cinco y están asignados a un dueño. |
| No sé qué archivos son míos | La carpeta. `tienda/carrito/` es de quien hace el carrito. |
| Alguien rompió el CSS de otra página | No podría, los archivos están separados por carpeta. |
| ¿Qué archivo abro para arreglar esto? | El de la carpeta donde está el problema. No hay que buscar en un archivo de 2000 líneas. |
| ¿Dónde meto este estilo? | En el archivo .css dentro de la carpeta de la página que se te asignó |

Estas convenciones ayudan a **eliminar decisiones**.
Cuando cinco personas están aprendiendo, cada decisión que se repite cinco veces
es **una decisión que se toma _cinco veces de forma distinta_**.

### A qué NO se parece

Aquí es donde más se confunde la gente, así que conviene decirlo claro:

| Puede parecer | Qué es en realidad |
|---|---|
| MVC | No. MVC (modelo, vista, controlador) es un patrón de **backend**. No hay `models/`, `views/` ni `controllers/` acá. |
| Una SPA de React | No. No hay un solo `index.html` que cambie de pantalla con JavaScript. Cada página es un HTML aparte que el navegador pide al servidor. |
| Arquitectura por capas | No. Capas sería `components/`, `services/`, `utils/` para todo el proyecto. Acá manda "grouping by feature". |
| Una estructura "correcta" y única | No existe una estructura única. Existen convenciones, y cada framework tiene la suya. |

### Dónde van a encontrar esto mismo

**Esta estructura que manejamos en el proyecto no es una simplificación para principiantes, ni únicamente para evitar conflictos en los merges, es lo mismo que se
ve en los frameworks grandes.**

| Framework o proyecto | Cómo se ven sus rutas | Qué se parece a Lumina |
|---|---|---|
| **Astro** | `src/pages/tienda/producto.astro` | Carpeta = ruta, todo junto. Es lo más parecido a esto. |
| **Next.js** (App Router) | `app/tienda/producto/page.tsx` | Carpeta = ruta. Además cada componente lleva su `.css` al lado. |
| **Nuxt** | `pages/tienda/producto.vue` | Carpeta = ruta, archivo con nombre de la página. |
| **SvelteKit** | `src/routes/tienda/producto/+page.svelte` | Carpeta = ruta. |
| **React** (un componente) | `components/ProductCard/ProductCard.jsx` + `ProductCard.css` | Colocación pura: el CSS pegado al componente. |
| **Hugo** | `content/tienda/producto/index.md` | Carpeta = sección, `index` = entrada. Sin build de JS. |
| **Laravel** (con módulos) | `app/Modules/Tienda/Productos/` | Módulos por dominio. No es el default de Laravel, pero es un patrón conocido. |
| **Spring Boot** | `com/lumina/tienda/producto/` | Paquetes por dominio. |

Hay un patrón, y es que en **todos** la carpeta es la ruta, y en **todos** lo que
pertenece a una página se guarda junto a esa página. Lo único que cambia es el
nombre de la carpeta y la extensión del archivo.

**Lo que cambia son las librerías, no la forma de organizarse.**
Cuando más adelante queramos aprender React o Astro, vamos a ver el proyecto y al abrir una carpeta y
vamos a reconocer esta misma estructura de carpetas, este mismo árbol.

## Rutas entre archivos

Las páginas públicas son hermanas entre sí, todas dentro de `tienda/` y a un
mismo nivel. Ninguna carpeta está dentro de otra: el detalle de producto es
`tienda/producto/`, no `tienda/catalogo/producto/`.

Admin es la excepción: sus módulos viven bajo `admin/`, también a un mismo nivel
entre sí.

Las dos zonas quedan al mismo nivel una de otra:

```
src/tienda/producto/index.html    # pública
src/admin/panel/index.html        # interna
```

Y desde cualquiera de las dos, los archivos compartidos se alcanzan con `../`:

```html
<!-- desde src/tienda/inicio/index.html o src/admin/panel/index.html -->
<link rel="stylesheet" href="../../css/main.css">
<script src="../../js/main.js"></script>
```

Eso es lo que hace que **ambos tipos de página usen exactamente las mismas
líneas**, y que el orden de carga sea idéntico en todo el sitio.

## CSS y JS: cómo se carga cada página

Las hojas se cargan en orden: primero Bootstrap, después las globales, y al
final la de la página, para que esta última gane en cascada.

**Cada módulo es dueño de su CSS y su JS.** Nadie edita los de otra página, así
que dos personas nunca modifican el mismo archivo y los merges no chocan.

```html
<!-- en tienda/inicio/index.html — página pública -->
<link rel="stylesheet" href="../../css/bootstrap.min.css">
<link rel="stylesheet" href="../../css/main.css">
<link rel="stylesheet" href="../../css/components.css">
<link rel="stylesheet" href="inicio.css">
```

```html
<!-- en admin/panel/index.html — panel de administración -->
<link rel="stylesheet" href="../../css/bootstrap.min.css">
<link rel="stylesheet" href="../../css/main.css">
<link rel="stylesheet" href="../../css/components.css">
<link rel="stylesheet" href="panel.css">
```

Fíjate que el panel de administración usa **las mismas líneas** que una página pública. Como
`tienda/` y `admin/` están al mismo nivel, no hay que aprender dos versiones de
las mismas rutas.

Y los scripts, al final del `<body>`:

```html
<!-- página pública: main, carrito compartido y el suyo -->
<script src="../../js/bootstrap.bundle.min.js"></script>
<script src="../../js/main.js"></script>
<script src="../../js/carrito.js"></script>
<script src="inicio.js"></script>
```

```html
<!-- panel: main, auth y el suyo. No carga el carrito -->
<script src="../../js/bootstrap.bundle.min.js"></script>
<script src="../../js/main.js"></script>
<script src="../../js/auth.js"></script>
<script src="panel.js"></script>
```

**Contar los `../` es fácil: cuenta carpetas hacia atrás.** Tanto una página de
`tienda/` como un módulo de `admin/` están **dos niveles** dentro de `src/`, así
que los archivos compartidos se piden con `../../` y Bootstrap con `../../../`.

```
lumina/                 ← raíz del repo
└── src/                ← ../../
    ├── css/main.css    ← ../../css/main.css
    ├── js/main.js      ← ../../js/main.js
    ├── tienda/         ← ../
    │   └── inicio/     ← ../../
    │       └── index.html
    └── admin/
        └── panel/
            └── index.html
```

Si una ruta no carga, el error casi siempre es un `../` de menos o de más.

#### Qué es un selector

Un **selector** es el nombre que le pones a un elemento para darle estilo. En
HTML le pones ese nombre con `class`; en CSS lo escribes con un punto delante.

```html
<h1 class="main-title">Lumina</h1>
```

```css
.main-title {
  color: #8B5E3C;
  font-size: 2rem;
}
```

`.main-title` es el selector. El punto es lo que le dice a CSS "esto es una
clase". Si esa misma clase aparece en varias páginas, el estilo le sirve a todas.

<a id="que-selector-va-en-cada-archivo"></a>

#### Qué selector va en cada archivo

| Tipo de estilo | Dónde |
|---|---|
| Variables, tipografía, layout | `css/main.css` |
| Header, footer, botones, cards, forms, modal | `css/components.css` |
| Lo único de *una* página | `tienda/<pagina>/<pagina>.css` |

Regla del equipo: si un selector se repite en varias páginas, es compartido y
va en `main.css` o `components.css`. Si aparece en una sola, va en el CSS de esa
página. Nunca se edita el CSS de otra página.

<a id="los-estilos-van-sobre-clases-no-sobre-etiquetas"></a>

#### Los estilos van sobre clases, no sobre etiquetas

Nunca se escribe CSS apuntando a una etiqueta suelta. Se le pone una clase al
elemento en el HTML y se estila esa clase.

```css
/* mal — no se acepta */
main {
  background-color: #FAF7F2;
}
body {
  font-family: sans-serif;
}
h1 {
  color: #8B5E3C;
}
```

```css
/* bien */
.page {
  background-color: #FAF7F2;
}
.content {
  font-family: sans-serif;
}
.main-title {
  color: #8B5E3C;
}
```

Con HTML:

```html
<body class="content">
  <main class="page">
    <h1 class="main-title">Lumina</h1>
  </main>
</body>
```

**Por qué:** `body`, `main`, `h1` son etiquetas de HTML, y Bootstrap ya les pone
estilo a todas. Si tú también les pones estilo, dependes del orden de carga y
gana quien se cargue último. Con clases, el selector es tuyo, es
único, y no se pisa con nadie.

Además da una ventaja práctica: `.main-title` lo puedes reutilizar en otra
página si algún día lo necesitas, porque el nombre describe el estilo y no la
etiqueta.

##### Cómo se nombran las clases

Los nombres de las clases van en **inglés** y en **kebab-case**: minúsculas, sin
espacios y separadas por guiones.

| Bien | Mal |
|---|---|
| `.product-card` | `.productCard` (camelCase) |
| `.cart-row` | `.cart_row` (snake_case) |
| `.primary-button` | `.primaryButton` (camelCase) |
| `.product-title` | `.Product-title` (con mayúscula inicial) |
| `.contact-form` | `.contact form` (con espacio) |

Esto aplica **solo a las clases de CSS**. Nada más en el proyecto sigue esta
regla.

Si en el HTML pones `class="product-card"` y en el CSS escribes
`.productCard`, el estilo no se aplica y se pierde tiempo buscando el error. El
error clásico.

<a id="convencion-de-idioma"></a>

#### Convención de idioma

**Decidido: el código va en inglés, las rutas van en español.**

La razón es sencilla: el código se lee muchas más veces de las que se escribe,
y casi todo el código que vas a leer en tu vida está en inglés. Acostumbrarse a
eso desde el primer día evita el susto cuando abras un proyecto real. Las rutas, en
cambio, son la dirección de tu tienda: que un cliente lea
`/tienda/crea-tu-vela/` y lo entienda vale más que la coherencia con el código.

| Elemento | Convención | Ejemplo |
|---|---|---|
| Carpetas y rutas | Español | `tienda/crea-tu-vela/` |
| Archivos | Español | `crea-tu-vela.css`, `index.html` |
| Clases CSS | Inglés + kebab-case | `.product-card` |
| IDs | Inglés + kebab-case | `#contact-form` |
| Variables CSS | Inglés + kebab-case | `--color-primary` |
| Variables JS | Inglés + camelCase | `totalPrice` |
| Funciones JS | Inglés + camelCase | `addToCart()` |
| Comentarios | Inglés | `// add item to the cart` |
| Textos visibles | Español | "Agregar al carrito" |
| Prefijos de commits | Inglés | `feat:`, `fix:`, `docs:` |

Ojo con la diferencia entre **carpeta** y **clase**, porque es la que más
confunde:

```
tienda/carrito/          ← carpeta: español (es la ruta que ve el usuario)
  └── carrito.css        ← archivo: español (hereda el nombre de la carpeta)
        └── .cart-row    ← clase: inglés (es código)
```

El archivo se llama como la carpeta a propósito, para que sea fácil encontrarlo.
Pero lo que escribes *dentro* del archivo va en inglés.

**Lo que no cambia:** el formato del nombre. Las clases van en kebab-case y las
variables de JavaScript en camelCase, siempre. El idioma es una cosa y el formato
otra.

Y si alguien se equivoca y escribe `.fila-carrito`, no es grave: se corrige. Lo
que sí es grave es que cada uno escriba como le dé la gana, porque entonces nadie
sabe qué buscar. La regla existe para que las respuestas sean iguales para todos.

<a id="convencion-de-nombres-de-archivos"></a>

## Convención de nombres de archivos

**Regla: los archivos de imagen y assets van en español y en kebab-case.**

Cuando agregues una imagen, un ícono, una foto o cualquier asset al proyecto, el
nombre del archivo va en **español**, en **kebab-case**, y nada más:

| Quién | Cómo | Ejemplos |
|---|---|---|
| Mayúsculas | No | `logo.png` ✓ · `Logo.png` ✗ |
| Espacios | No | `foto-perfil.jpg` ✓ · `foto perfil.jpg` ✗ |
| Guiones bajos | No | `icono-carrito.svg` ✓ · `icono_carrito.svg` ✗ |
| Números sueltos | No | `portada.png` ✓ · `imagen123.png` ✗ |
| Palabras pegadas sin guion | No | `crea-tu-vela.jpg` ✓ · `creatuvela.jpg` ✗ |

### Cómo se escribe un nombre válido

Se arma como una frase corta, en español, y cada palabra se separa con un guion:

```
crea tu vela + .jpg   →  crea-tu-vela.jpg
logo del sitio + .png  →  logo-del-sitio.png
icono del carrito + .svg →  icono-del-carrito.svg
```

Las palabras van **en orden de lectura**, como se dice la frase en voz alta. Se lee
"crea-tu-vela" y se entiende sola. Esa es la prueba: si el nombre se entiende
diciéndolo en voz alta, está bien escrito.

### Qué NO hacer

```text
MiFoto123.png        ✗  mayúsculas, número suelto, sin separación
logo_test_123.svg     ✗  guiones bajos y número de control interno
iconoInicio.svg      ✗  pegado y en camelCase, que es el formato del código
Captura de pantalla.png  ✗  espacios, y ni siquiera se sabe qué captura es
imagen-final-v2.png  ✗  el "v2" se agrega con Git, no en el nombre del archivo
nuevo-logo-2.png     ✗  la segunda versión de un archivo es casi siempre un error
```

Los dos últimos casos merecen atención porque son los que más se repiten:

- **El `v2`, `final`, `nuevo`, `copia` casi siempre sobran.** Si necesitas cambiar
  una imagen, se reemplaza la misma y el cambio queda registrado en el historial de
  Git. No hace falta guardar la anterior.
- **Los números sueltos (`123`, `01`, `2`) no significan nada para quien lea.** Un
  mes después nadie sabe qué era `imagen123.png`. Si de verdad hay varias imágenes
  distintas, se llaman por lo que muestran: `antes.jpg` y `despues.jpg`.

### Formatos de imagen

| Formato | Para qué usarlo |
|---|---|
| `.png` | Logos con transparencia, capturas, imágenes con texto nítido |
| `.jpg` / `.jpeg` | Fotos. No necesita transparencia |
| `.svg` | Íconos y logos vectoriales. **Preferido**, porque no pixelan |
| `.webp` | Fotos pesadas en la web. Mucho más liviano que `.jpg` |
| `.gif` | Solo si la imagen se anima de verdad |

Cuando tengas que elegir entre `.png` y `.svg` para un ícono, gana `.svg`: se ve
nítido en cualquier pantalla y no se pixela al ampliarlo.

### Rutas y carpetas

Los mismos criterios de kebab-case y minúsculas aplican a las carpetas. Ya lo dice
la regla 13, pero conviene recordarlo porque las rutas sí van en español:

```text
tienda/crea-tu-vela/    ✓  carpeta en español y kebab-case
tienda/CreaTuVela/      ✗  mayúsculas y pegado
tienda/crea tu vela/    ✗  espacios en la ruta
tienda/crea_tu_vela/    ✗  guiones bajos
```

Una diferencia importante: en las rutas y carpetas **no se usan números**. No hay
`producto-2/` ni `pagina-v2/`. Si hay dos cosas distintas, se llaman por lo que
son: `blog/` y `noticias/`, no `blog/` y `blog-2/`.

### Dónde van

Los archivos de `src/assets/` van separados por tipo:

```text
assets/
├── img/     ← fotos, capturas, imágenes de contenido
├── icons/   ← íconos, normalmente .svg
└── fonts/   ← tipografías, en .woff2 o .woff
```

Dentro de cada carpeta sigue la misma regla: español y kebab-case. Por ejemplo
`assets/img/foto-del-equipo.jpg` e `assets/icons/icono-de-whatsapp.svg`.

Estas carpetas hoy están vacías, con un `.gitkeep` para que Git no las borre. Eso
está bien: se llenan cuando cada quien vaya viendo qué imagen necesita su
página.

<a id="indentacion-sangria"></a>

## Indentación (sangría)

**Regla: 2 espacios. En HTML, CSS y JavaScript. Nunca tabulaciones.**

### Cómo se ve bien

```html
<main>
  <h1>Lumina</h1>
</main>
```

```css
.btn-primary {
  background-color: #8B5E3C;
  color: white;
}
```

```js
function addToCart(item) {
  cart.push(item);
}
```

### Cómo se ve mal

```css
/* mal: 4 espacios */
.btn-primary {
    background-color: #8B5E3C;
}
```

```css
/* mal: tabulaciones (el ancho lo decide cada editor) */
.btn-primary	{
	background-color: #8B5E3C;
}
```

Fíjate en el segundo ejemplo: si dos personas usan tabulaciones, la misma línea se
ve más corta en una pantalla y más larga en la otra. Con 2 espacios se ve
exactamente igual en todas partes. Ese es el motivo real de la regla.

### Por qué 2 y no 4

Bootstrap, que ya está en este proyecto, usa 2 espacios. CSS, HTML y JavaScript
usan 2 espacios como estándar. Cuando más adelante instales un framework con su
propia guía de estilo, casi siempre va a ser 2 también. Aprendiéndolo desde ahora
no hay que reaprender nada después.

### Cómo configurar VS Code

La sangría de este proyecto **no se configura a mano**: la define el archivo
`.editorconfig` de la raíz. Pero VS Code **no lo lee por sí solo**, así que hace
falta una extensión. Esto se hace **una vez** por computador.

#### Instala la extensión EditorConfig

1. Presiona `Ctrl + Shift + X` (`Cmd + Shift + X` en Mac) para abrir Extensiones.
2. Escribe `EditorConfig` en el buscador.
3. Instala la que publica **EditorConfig**. Es la oficial, y es la misma que vas
   a encontrar en cualquier otro editor.
4. Reinicia VS Code si te lo pide.

Listo. Al abrir cualquier archivo de este proyecto, VS Code aplica las reglas del
`.editorconfig`: 2 espacios, finales de línea LF y UTF-8. No hay que tocar nada
más.

Sin la extensión, VS Code ignora el archivo y sigue con su valor por defecto, que
casi siempre son 4 espacios. Ese olvido es hoy la causa más probable de que la
sangría se te desalinee.

#### Cómo comprobar que funciona

Abre cualquier archivo del proyecto y mira la barra inferior derecha: debe decir
**`Spaces: 2`**. Si dice `Spaces: 4`, la extensión no está instalada o no se ha
cargado todavía: reinicia VS Code.

VS Code trae además un ajuste llamado **Detect Indentation** que, al abrir un
archivo, mira su contenido y adivina la sangría. La extensión vuelve a aplicar el
`.editorconfig` cada vez que cambias de pestaña o vuelves a la ventana, así que
dentro de este proyecto la regla manda. Puedes desmarcarlo en Configuración
(`Ctrl + ,` / `Cmd + ,`) por si acaso; cuesta nada.

### Antes de subir cambios: verificar la sangría

**El `.editorconfig` no arregla un archivo por ti.** Le dice a tu editor cómo
indentar lo que escribas a partir de ahora, pero **no re-indenta lo que ya está
adentro**. Si pegas un bloque con tabulaciones o abres un archivo hecho con 4
espacios, el contenido sigue igual hasta que lo formatees tú.

Y `end_of_line`, `insert_final_newline` y `trim_trailing_whitespace` solo actúan
al guardar desde el editor, así que un archivo tocado desde otra herramienta
puede quedar sin ellos.

Por eso estos pasos siguen siendo obligatorios.

**Este es el paso que más se olvida, y el que más problemas trae.** Revisar antes
de hacer `git push` toma un minuto y evita subir un archivo con 4 espacios o con
tabs que después genera conflictos a todo el equipo.

#### Ver los espacios de verdad

Para que la sangría deje de ser invisible, en Configuración busca `render
whitespace` y pon **Editor: Render Whitespace** en `all`.

A partir de ahí VS Code dibuja los espacios como puntitos `·` y las
tabulaciones como flechitas `→`. Una tabulación se distingue a simple vista.

Después de ese ajuste, sangría correcta se ve así:

```
··<h1>Lumina</h1>
··<p>Texto</p>
```

Y una tabulación se ve así:

```
→<h1>Lumina</h1>
→<p>Texto</p>
```

#### Formatear antes de commitear

Con el archivo abierto, se formatea todo de un golpe:

- **Windows:** `Shift + Alt + F`
- **Mac:** `Shift + Option + F`

VS Code trae un formateador para HTML, CSS y JavaScript, así que no hay que
instalar nada. Ojo: **esto respeta tu configuración de sangría**, así que si
tienes mal el `Tab Size`, formatear te va a dejar el archivo con 4 espacios.

Si el atajo no hace nada, es que no hay formateador para ese tipo de archivo:
haz clic derecho sobre el código y busca **Format Document**.

#### Mirar el diff

La última revisión, antes del commit. En la pestaña de Git de VS Code, o con:

```bash
git diff
```

Si ves líneas enteras que cambiaron pero no tocaste, casi siempre es un cambio de
sangría. Borra esos cambios.

#### Si venías usando tabulaciones

Si tus archivos antiguos tienen tabs, hay un comando que los convierte. En Windows
`Ctrl + Shift + P`, en Mac `Cmd + Shift + P`, escribe **Convert Indentation to
Spaces** y dale Enter.

Hazlo **antes** de tu primer commit, no después. Si ya los subiste, el cambio
genera un conflicto con todos los que tocaron ese archivo.

### Referencias

- Hojas de estilo de Bootstrap (2 espacios): <https://getbootstrap.com/docs/5.3/contribute/code/>
- Documentación de `editor.tabSize` en VS Code: <https://code.visualstudio.com/docs/getstarted/settings>

<a id="git-reglas-para-reducir-conflictos-de-merge"></a>

## Git: reglas para reducir conflictos de merge

La idea central: **cada persona trabaja en su propia página.** Eso reduce la
mayoría de los conflictos al integrar los cambios de los 5 integrantes en una sola rama.

<a id="archivos-compartidos"></a>

### Archivos compartidos

De todos los archivos del proyecto, **cinco son los únicos que puede tocar más de
una persona.** Todo lo demás es de una sola persona y nunca da problemas de merge.

| Archivo | Tipo | Qué hace | ¿Puede chocar? |
|---|---|---|---|
| `css/main.css` | CSS | Variables, tipografía, layout | **Sí** |
| `css/components.css` | CSS | Header, footer, botones, cards, forms, modal | **Sí** |
| `js/main.js` | JS | Init, menú, footer | **Sí** |
| `js/carrito.js` | JS | Carrito en `localStorage` | **Sí** |
| `js/auth.js` | JS | Estado de usuario | **Sí** |

Estos archivos son los únicos que hacen falta coordinar. Antes de editarlos se
avisa en el chat y se espera el visto bueno, y quien ya los esté editando avisa
que ya está revisando. Si dos personas los necesitan a la vez, la segunda trabaja
en una rama aparte hasta que la primera haga merge.

Los archivos de tu propia página van aquí y no pueden chocar con nadie:

| Archivo | Tipo | Quién lo edita | ¿Puede chocar? |
|---|---|---|---|
| `tienda/<tu-pagina>/index.html` | HTML | solo tú | No |
| `tienda/<tu-pagina>/<tu-pagina>.css` | CSS | solo tú | No |
| `tienda/<tu-pagina>/<tu-pagina>.js` | JS | solo tú | No |
| `admin/<tu-pagina>/` completo | Los tres | solo tú | No |

Y dos archivos que **no se editan nunca**, porque son de Bootstrap:

| Archivo | Quién lo edita |
|---|---|
| `css/bootstrap.min.css` | nadie |
| `js/bootstrap.bundle.min.js` | nadie |

### Lo que este esquema NO arregla

Si todos a la vez editamos los archivos `main.css`, `components.css`,
`carrito.js` o `auth.js`, los merges **sí chocarán**.

Cuando necesites un estilo compartido, **no lo crees en el CSS de tu página**:
avisa en el chat y una sola persona lo agrega a `components.css`. Lo mismo con
JavaScript: si tu código sirve a otras páginas, va en `js/main.js`, y se avisa
antes de tocarlo.

La forma de resolverlo está en [Ramas y commits](#ramas-y-commits).

<a id="flujo-diario"></a>

### Flujo diario

```bash
git checkout main
git pull
git checkout -b arr/sobre-nosotros

# editar SOLO tus archivos

git add tienda/sobre-nosotros/
git commit -m "feat: agregar banner y productos destacados en sobre-nosotros"
git push --set-upstream origin arr/sobre-nosotros
```

Después se abre un Pull Request desde esa rama hacia `main`, y alguien más lo
revisa antes de integrar.

Cuatro reglas:

1. **Empieza siempre con `git pull`.** Así traes lo que subieron los demás.
2. **`git add` con los nombres de archivo**, nunca `git add -A` ni `git add .`:
   así no subes por accidente el archivo de otra persona.
3. **Nunca `git push --force` sobre `main`.** Borra el trabajo de los demás.
4. **Nunca trabajes directo sobre `main`.** Siempre en una rama, siempre con
   prefijo en el commit.

<a id="ramas-y-commits"></a>

## Ramas y commits

Todo el equipo sigue estas dos convenciones. Hacen que se
entienda de un vistazo qué cambió y quién lo hizo, sin tener que abrir el código.

<a id="como-se-nombran-nuestras-ramas"></a>

### Cómo nombrar nuestras ramas

```
iniciales-del-integrante/nombre-de-la-pagina
```

Todo en minúsculas, separado por guiones.

| Ejemplo | Qué significa |
|---|---|
| `arr/sobre-nosotros` | la página Nosotros, de Argie Rincón Rodríguez |
| `psq/carrito-compras` | la página Carrito, de Pedro Saravia Quispe |
| `mcb/catalogo` | la página Catálogo, de María Camila Berrío |

Como la rama empieza con las iniciales, se sabe rápido quién la creó. Y como termina con el nombre de la página, se sabe rápido qué tarea se trabajó allí.

Para crear una rama:

```bash
git checkout -b sobre-nosotros-ar
```

Cuando termines, se abre un Pull Request hacia `main` y alguien más lo revisa
antes de integrar. Nunca se trabaja directo sobre `main`.

<a id="prefijos-de-los-commits"></a>

### Prefijos de los commits

Cada commit empieza con un prefijo que dice **qué tipo de cambio es**. Después
del prefijo, una descripción corta de lo que se hizo.

```
prefijo: descripción corta de lo que cambiaste
```

| Prefijo | Qué significa | Ejemplo |
|---|---|---|
| `feat:` | nueva funcionalidad. Agregaste algo que antes no existía | `feat: agregar sección de productos destacados en inicio` |
| `fix:` | corregiste un error | `fix: modal de carrito que no cerraba al confirmar` |
| `docs:` | solo cambiaste documentación | `docs: explicar qué es un selector` |
| `style:` | cambios de estilo que **no** cambian el comportamiento | `style: ajustar espaciado del footer` |
| `refactor:` | reorganizaste el código, pero el resultado es el mismo | `refactor: separar el wizard en cinco funciones` |

**`feat:` frente a `fix:`** es el que más se confunde: si al terminar la página se
ve algo que antes no estaba, es `feat:`. Si se veía mal y ahora se ve bien, es
`fix:`.

Otros prefijos que existen, para cuando hagan falta:

| Prefijo | Qué significa |
|---|---|
| `chore:` | tareas que no tocan el sitio, como instalar una dependencia |
| `test:` | agregaste o corregiste pruebas |
| `perf:` | mejoraste el rendimiento |

### Cómo se escribe el mensaje

- En minúsculas, sin punto al final.
- Describe **qué** cambiaste, no "cambios varios" ni "ajustes".
- Si el cambio es grande, se puede agregar una línea de detalle abajo:

```bash
git commit -m "feat: agregar filtros de aroma y precio en catalogo

Se agregaron filtros por aroma, precio y color con JavaScript,
porque no hay servidor que consulten."
```

## Bootstrap

Bootstrap **ya está en el proyecto**. No hay que instalar nada.

| Archivo | Qué es |
|---|---|
| `css/bootstrap.min.css` | Los estilos de Bootstrap 5.3.8 |
| `js/bootstrap.bundle.min.js` | El JavaScript de Bootstrap, con Popper incluido |

Se descargaron del CDN de jsDelivr y se guardaron en el repo. Así el sitio abre
sin internet y sin `npm install`, que para este equipo es lo más simple.

**⚠️ Esos dos archivos son de Bootstrap, no nuestros. No se editan.** Si el
equipo decide más adelante actualizar la versión, se vuelven a descargar; no se
tocan a mano. Todo lo demás que escriban ustedes va en `main.css`,
`components.css` o en el CSS de su propia página.

### Por qué está en el repo y no por CDN

La alternativa era poner `<link href="https://cdn.jsdelivr.net/...">`, que no
requiere ningún archivo. No se eligió así a propósito:

- La página abre **sin internet**, que importa en una ferretería con señal mala.
- Si el CDN se cae o cambia, el sitio no se rompe.
- El equipo no depende de que jsDelivr sirva la misma versión mañana.

Lo que sí tiene el CDN es que **los `.map` (source maps) no se descargaron**:
son 900 KB que solo usa el DevTools. Por eso se quitó la última línea
`sourceMappingURL` de cada archivo, para que la consola no muestre errores de
archivo inexistente.

### Orden de carga

Bootstrap va **primero**, antes de cualquier CSS propio. Si lo pones después, su
Reboot pisa tus estilos y los cambios no se ven.

```
bootstrap.min.css → main.css → components.css → <tu-pagina>.css
```

Lo mismo con los scripts: `bootstrap.bundle.min.js` va antes que tu JS.

Y en cada HTML el link queda así, con las mismas cuatro líneas para todos:

```html
<!-- Bootstrap va primero: su Reboot no debe pisar tus estilos -->
<link rel="stylesheet" href="../../css/bootstrap.min.css">

<link rel="stylesheet" href="../../css/main.css">
<link rel="stylesheet" href="../../css/components.css">
<link rel="stylesheet" href="login.css">
```

### Reboot ES el reset

Bootstrap 5 ya trae un reset llamado Reboot. **No escribas un reset propio**: este
proyecto no tiene ninguno a propósito, para no duplicar ni pelear con el de
Bootstrap.

Como Bootstrap ya está cargado, **las páginas ya se ven con su línea base**:
las viñetas desaparecen, los botones tienen su padding y las imágenes respetan el
ancho. Si algo se ve raro, casi siempre es que el CSS propio se está pisando con
Bootstrap por orden de carga, no que falte el reset.

### El script de Bootstrap va antes que tu JS

No es arbitrario. El modal de confirmar pedido se abre con la API de Bootstrap:

```js
bootstrap.Modal.getOrCreateInstance(document.querySelector('#mi-modal')).show();
```

Ese `bootstrap` global solo existe si `bootstrap.bundle.min.js` ya se cargó. Si
el JS de la página se carga primero, `bootstrap` es `undefined` y el carrito falla.

### Cómo actualizar Bootstrap más adelante

```bash
curl -o css/bootstrap.min.css https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css
curl -o js/bootstrap.bundle.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js
```

Ojo: al descargarlo así vuelve la línea `sourceMappingURL` al final. Bórrala
para no dejar un archivo roto referenciado. Después, revisar que las páginas
sigan viéndose bien y hacer el commit con prefijo `chore:`.

### Qué va en main.css

Nada todavía. Ese archivo no se llena hasta que haya contenido real:

- Tokens en `:root` — colores, escala de espaciado, tipografías
- `.container` — ancho máximo y centrado

### Tipografías

Pendiente de decisión. Aún no hay fuente elegida, así que no hay variables de
fuente ni `@font-face`. Cuando se decida, la variable va en `:root` y los
archivos en `assets/fonts/`.

## Notas técnicas

### Carrito compartido entre páginas

El sitio es multipágina sin servidor, así que el carrito no puede vivir en
memoria. Se guarda en `localStorage` bajo una sola clave y `js/carrito.js` lo lee
en cada página. Temporal: ver Fase 2 en el README.

Si no, el carrito se vacía al cambiar de página.

### Cerrar pedido

El modal de confirmación vive en `tienda/carrito/index.html`. Al confirmar, el pedido se
guarda en `localStorage` para que `tienda/pedidos/index.html` lo muestre. Temporal: ver Fase 2
en el README.

## Responsive

El diseño es adaptable a móvil y escritorio. En Bootstrap, eso se resuelve con el
sistema de grid y los puntos de quiebre; en CSS propio, con media queries.
