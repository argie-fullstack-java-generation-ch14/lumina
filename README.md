# Lumina

Tienda de velas personalizadas. Sitio público + panel de administrador.

Fase 1: HTML/CSS/JS sin servidor. Fase 2: API Java/Spring Boot + MySQL.

Este documento es el **modelo de negocio**: qué es Lumina, qué páginas tiene y
qué hace cada una. Para la parte técnica —estructura de carpetas, CSS, Bootstrap
y reglas del equipo con Git— ver [docs/DESARROLLO.md](docs/DESARROLLO.md).

## Cómo verlo

```bash
open src/tienda/inicio/index.html
```

Con esta estructura, cada página es una carpeta con su propio HTML, CSS y JS
(como en React). El navegador muestra `/tienda/inicio/index.html` en la barra de
direcciones.

## Mapa de navegación

### Sitio público

**`Menú`** en la columna "Desde" no es una página: es el Header / Navbar, el
componente que se repite en todas las páginas. Da acceso directo a Inicio,
Catálogo, Crea tu Vela, Nosotros, Contacto, Carrito y Usuario.

La entrada de Usuario es condicional: **sin sesión muestra `Login`, con sesión
muestra `Perfil`**.

| Sección | Archivo | Desde |
|---|---|---|
| Inicio | `src/tienda/inicio/index.html` | Menú |
| Catálogo | `src/tienda/catalogo/index.html` | Menú |
| Detalle de producto | `src/tienda/producto/index.html?id=1` | Inicio, Catálogo |
| Crea tu vela | `src/tienda/crea-tu-vela/index.html` | Menú |
| Carrito | `src/tienda/carrito/index.html` | Menú |
| Nosotros | `src/tienda/nosotros/index.html` | Menú |
| Contacto | `src/tienda/contacto/index.html` | Menú |
| Login | `src/tienda/login/index.html` | Menú (sin sesión), perfil |
| Registro | `src/tienda/registro/index.html` | Login |
| Recuperar contraseña | `src/tienda/recuperar-contrasena/index.html` | Login |
| Perfil | `src/tienda/perfil/index.html` | Menú (con sesión) |
| Pedidos | `src/tienda/pedidos/index.html` | Perfil |

### Acciones dentro de una página (no son páginas)

| Acción | Ocurre en |
|---|---|
| Agregar al carrito | `src/tienda/producto/index.html`, `src/tienda/crea-tu-vela/index.html` |
| Editar cantidad / eliminar | `src/tienda/carrito/index.html` |
| Confirmar pedido (modal) | `src/tienda/carrito/index.html` |

### Panel admin

| Sección | Archivo |
|---|---|
| Panel | `src/admin/panel/index.html` |
| Productos | `src/admin/productos/index.html` |
| Crear / actualizar | `src/admin/producto-formulario/index.html` |
| Pedidos | `src/admin/pedidos/index.html` |

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

## Catálogo

Cada tarjeta de producto lleva: imagen, nombre, aroma, precio, disponibilidad,
botón de ver detalle y opción de agregar al carrito.

Los filtros (categoría, aroma, precio, color), el orden por precio o novedad y
la paginación funcionan con JavaScript, porque no hay servidor que consulten.
