# Plan de Integración Front-Back — Lumina

**Backend:** `http://localhost:8080/api/...` (Spring Boot 3, MySQL, JWT implementado)  
**Frontend:** `lumina/` (HTML/CSS/JS puro, Live Server o `npx serve`)  
**Rama sugerida:** `feature/integracion-front-back` (desde `main`)  

---

## Rama de trabajo

El refactor nace de la rama base `integracion/front-back`, creada desde `main`. Cada integrante crea su rama hija a partir de `integracion/front-back`, trabaja solo en sus archivos y abre un Pull Request hacia esa misma rama base. Si no hay conflictos, se hace merge directamente a `integracion/front-back`; si hay conflictos, se resuelven y luego se hace el merge. Solo al final, con todos los roles integrados y el build verde, `integracion/front-back` se fusiona a `main`.

## Estrategia de ramas y Git

1. El responsable de integración crea la rama base desde `main`:

   ```bash
   git switch main
   git pull
   git switch -c integracion/front-back
   git push -u origin integracion/front-back
   ```

2. Cada integrante crea su rama desde `integracion/front-back`:

   ```bash
   git switch integracion/front-back
   git pull
   git switch -c integracion/bases-login-argie   # ejemplo para el Rol A
   ```

3. Nombres sugeridos de rama:

   | Rol | Rama |
   |-----|------|
   | A | `integracion/bases-login-argie` |
   | B | `integracion/catalogo-naya` |
   | C | `integracion/auth-y-pedidos-nicole` |
   | D | `integracion/admin-pedro` |

4. Cada integrante trabaja solo en los archivos de su rol y abre un PR hacia `integracion/front-back`. Si el PR no tiene conflictos, se hace merge directamente; si tiene conflictos, se resuelven y luego se hace el merge. No es necesaria la aprobación formal del PR por temas de tiempo.

5. El build y el smoke test se ejecutan al final, con todos los roles integrados.

6. Si todo pasa, `integracion/front-back` se fusiona a `main`.

---

## Resumen de entregables por Rol

| Rol | Fase | Archivos clave | Dificultad |
|-----|------|----------------|------------|
| [**Rol A (Argie, Parte 1)**](#rol-a-argie-parte-1-bases-de-integracion) | Base + Login + Auth header + Logout | `src/api/client.js`, `src/api/endpoints.js`, `src/api/adapters.js`, `src/api/authGuard.js`, `src/api/services/usuarios.service.js`, `src/tienda/login/login.js`, `src/tienda/registro/registro-ui.js`, `src/tienda/registro/registro-back.js`, `src/admin/login/login.js`, `src/js/main.js` | 4/5 |
| [**B (Naya)**](#rol-b-naya-integracion-de-catalogo-y-detalle-de-productos) | Catálogo + Carrito | `src/api/services/productos.service.js`, `src/js/productos.js`, `src/js/carrito.js`, `src/tienda/catalogo/` | 3/5 |
| [**C (Nicole)**](#rol-c-nicole-integracion-de-autenticacion-y-pedidos) | Auth + Pedidos | `src/api/services/usuarios.service.js`, `src/api/services/pedidos.service.js`, `src/componentes/checkout-modal/`, `src/tienda/mi-cuenta/pedidos/` | 3/5 |
| [**D (Pedro)**](#rol-d-pedro-integracion-del-panel-de-administracion) | Admin | `src/admin/productos/`, `src/admin/producto-formulario/`, `src/admin/producto-detalle/` | 4/5 |
| [**A (Argie, Parte 2)**](#rol-a-argie-parte-2-unificacion-y-merge) | Unificación | Rama `feature/integracion-completa`, PR a `main`, smoke test final | 5/5 |

---

## Notas para los Roles B, C y D — Base dejada por el Rol A

**0. Levantar el backend (requisito previo para integrar)**
- El front apunta por defecto a `http://localhost:8080/api/...` (definido en `src/api/client.js`).
- Arrancar el backend de Spring Boot en el puerto 8080 antes de probar cualquier integración.
- Si el backend corre en otra URL o puerto, definir `window.LUMINA_API_URL` antes de cargar los scripts del front, o sobreescribir `API_BASE_URL`.
- Verificar CORS: el backend debe permitir peticiones desde el origen del front (ej. `http://localhost:3000` o `http://localhost:5500`).

**1. Backend (revisar antes de trabajar)**
- Bajar lo último de `main` del repositorio del backend antes de empezar.
- Revisar el `README.md` del backend para instrucciones de arranque, variables de entorno y cualquier cambio reciente en los endpoints.
- Confirmar que los endpoints que van a usar existen y devuelven el formato esperado (ej. `POST /api/registro` devuelve `{ id, fullName, phone, email, role }`).
- Endpoints que el front consume (todos bajo `/api/`):
  - `POST /api/registro` — registro de usuario
  - `POST /api/login` — inicio de sesión (devuelve `token` y `user`)
  - `GET /api/productos`, `GET /api/productos/{id}`, `GET /api/productos/slug/{slug}`
  - `GET /api/productos?categoria=...`, `GET /api/productos?disponibles=true`
  - `GET /api/usuarios/{id}`, `PUT /api/usuarios/{id}`
  - `POST /api/pedidos`, `GET /api/pedidos?usuarioId=`, `PUT /api/pedidos/{id}/estado`

**2. Reutilizar, no duplicar**
- `src/api/services/usuarios.service.js` ya tiene `registrar()`, `login()`, `obtenerUsuario()`, `actualizarUsuario()`. No creen lógica de login/registro duplicada en sus vistas.
- `src/api/authGuard.js` ya tiene `requireAuth(rolesPermitidos)`. Úsenlo para proteger vistas (Rol C en mi-cuenta, Rol D en admin).
- `src/api/client.js` y `src/api/endpoints.js` ya están listos. No los modifiquen salvo que sea estrictamente necesario.

**3. Módulos ES**
- Cualquier archivo que use `import`/`export` debe cargarse en el HTML con `<script type="module">`. Si no, el navegador lanza `SyntaxError` y nada del script se ejecuta.

**4. Estructura de registro**
- El registro se dividió en `src/tienda/registro/registro-ui.js` (interfaz, validaciones, animación, toggle de ojito) y `src/tienda/registro/registro-back.js` (llamada a `registrar()` del servicio). `index.html` importa `registro-ui.js`.

**5. `APP_BASE`**
- Ya está definido en `src/js/ui.js` y redefinido explícitamente en `src/js/main.js`. No lo redeclaren en otros archivos para evitar `Identifier 'APP_BASE' has already been declared`.

**6. Logout**
- El botón de cerrar sesión en `src/js/main.js` borra tanto `token` como `usuarioActivo` de `localStorage`. Si agregan otro botón de logout, hagan lo mismo.

**7. Estado de protección actual**
- ✅ `src/tienda/mi-cuenta/index.html` protegido con `requireAuth()`.
- ❌ Subpáginas de mi-cuenta (`info/`, `pedidos/`, `favoritos/`) **no** están protegidas si se acceden directo por URL (pendiente para Rol C).
- ❌ Vistas de admin (`src/admin/productos/index.html`, `src/admin/producto-detalle/index.html`) **no** están protegidas (pendiente para Rol D, tarea 8).

**8. Rama de trabajo**
- Partan de `integracion/bases-login-argie`. Cada uno crea su rama hija desde ahí y abre su PR hacia `integracion/front-back`.

---

## <a name="rol-a-argie-parte-1-bases-de-integracion"></a>Rol A (Argie) — Parte 1: Bases de integración (Dificultad: 2/5)

**Objetivo:** Dejar lista la infraestructura mínima para que los demás roles solo conecten vistas con APIs, sin preocuparse por configuración de red, base URL o manejo de errores.

### Tareas

1. ✅ **Crear `src/api/client.js`**
   - ✅ Constante `API_BASE_URL` (default `http://localhost:8080`, sobreescribible por `window.LUMINA_API_URL` o variable de entorno)
   - ✅ Funciones genéricas `apiGet`, `apiPost`, `apiPut`, `apiDelete`
   - ✅ Headers JSON automáticos
   - ✅ Inyección opcional del token `Authorization: Bearer <token>` desde `localStorage`
   - ✅ Parseo centralizado de errores `ApiError` (`{ status, error, message, details, timestamp }`)

2. ✅ **Crear `src/api/endpoints.js`**
   - ✅ Centralizar todas las rutas del backend:
     - ✅ `/api/productos`, `/api/productos/{id}`, `/api/productos/slug/{slug}`
     - ✅ `/api/registro`, `/api/login`
     - ✅ `/api/usuarios/{id}`
     - ✅ `/api/pedidos`, `/api/pedidos?usuarioId=`, `/api/pedidos/{id}/estado`

3. ✅ **Crear `src/api/adapters.js`**
   - ✅ Funciones de mapeo backend → front y front → backend
   - ✅ Mapeo de estados de pedido: `PENDING` → `Pendiente`, `CONFIRMED` → `Confirmado`, etc.
   - ✅ Mapeo de usuario: `fullName` ↔ `nombreCompleto`, `phone` ↔ `telefono`
   - ✅ Función para extraer `orderNumber` como `numeroOrden`

4. ✅ **Preparar la vista de login para administración**
   - ✅ `src/tienda/login/login.js`: llamar `POST /api/login` vía `usuarios.service.js` (`login()`)
   - ✅ `src/admin/login/login.js`: llamar `POST /api/login` vía `usuarios.service.js` (`login()`)
   - ✅ Al éxito: guardar `token` y `user` (sin contraseña) en `localStorage`
   - ✅ Redireccionar al panel de administración si el rol es `ADMIN` o `STAFF`; si es `CUSTOMER`, redirigir a tienda/mi-cuenta
   - ✅ Mostrar error genérico 401 sin revelar si el correo existe
   - ✅ Reutilizar `src/api/client.js` y `src/api/endpoints.js` creados en el Rol A
   - ✅ Eliminar lógica duplicada de `apiPost` local en `admin/login/login.js`

5. ✅ **Verificar compilación/arranque del front**
   - ✅ Correr Live Server en `http://localhost:5500` **o** `npx serve` en el puerto deseado (ej. `npx serve -l 3000`)
   - ✅ Confirmar que CORS funciona con el backend

6. ✅ **Crear vista de login para el módulo de administración**
   - ✅ `src/admin/login/login.html` con formulario de inicio de sesión (ya existía)
   - ✅ `src/admin/login/login.js` con llamada a `POST /api/login` vía `usuarios.service.js`
   - ✅ Al éxito: guardar `token` y `usuarioActivo` en `localStorage`, redirigir a `src/admin/productos/index.html`
   - ✅ Mostrar error genérico 401 sin revelar si el correo existe
   - ✅ Reutilizar `src/api/client.js` y `src/api/endpoints.js` creados en el Rol A

7. ✅ **Proteger vistas del administración contra acceso no autorizado**
   - ✅ Crear `src/api/authGuard.js` con función `requireAuth(rolesPermitidos)`
   - ✅ Verificar que exista `token` en `localStorage` y que el rol del `usuarioActivo` esté en `rolesPermitidos` (ej. `['ADMIN', 'STAFF']`)
   - ✅ Si no hay sesión o el rol no autoriza, redirigir a `src/tienda/login/index.html`
   - ✅ Llamar a `requireAuth(['ADMIN', 'STAFF'])` al inicio de cada vista del panel de administración

8. ✅ **Conectar la página de registro al backend**
   - ✅ Dividir en `src/tienda/registro/registro-ui.js` (UI, validaciones, animación, toggle ojito) y `src/tienda/registro/registro-back.js` (llamada a API)
   - ✅ `registro-back.js` llama `registrar()` de `src/api/services/usuarios.service.js` → `POST /api/registro`
   - ✅ Al éxito: guardar `UserResponse` en `usuarioActivo` (sin contraseña), ejecutar animación `playEnding()` y mostrar link "Iniciar sesión" (sin redireccionar automáticamente)
   - ✅ Mostrar errores de validación (`400`, `409`) en el formulario correspondiente
   - ✅ Toggle de mostrar/ocultar contraseña funciona en ambos campos (contraseña y confirmar)
   - ✅ Script cargado con `type="module"` en `index.html` para permitir `import`

9. ✅ **Bases que deja el Rol A para el Rol C (no tocar, solo usar)**
   - ✅ `src/api/client.js`: funciones `apiGet`, `apiPost`, `apiPut`, `apiDelete` con `API_BASE_URL` ya configurada
   - ✅ `src/api/endpoints.js`: todas las rutas del backend centralizadas (`endpoints.auth.login`, `endpoints.auth.register`, `endpoints.usuarios.byId`, `endpoints.pedidos.*`, etc.)
   - ✅ `src/api/adapters.js`: funciones `mapEstadoPedido`, `mapUsuario`, `mapProducto`, `mapOrderResponse`
   - ✅ `src/api/authGuard.js`: función `requireAuth(rolesPermitidos)` para proteger vistas
   - ✅ `src/api/services/usuarios.service.js`: `registrar()`, `login()`, `obtenerUsuario()`, `actualizarUsuario()` — reutilizar para autenticación y usuarios
   - ✅ `src/tienda/login/login.js`: ejemplo de cómo llamar a `POST /api/login` y guardar `token` + `usuarioActivo` en `localStorage`
   - ✅ `src/tienda/registro/registro-back.js`: ejemplo de cómo llamar a `POST /api/registro`
   - El Rol C debe reutilizar estos archivos sin modificarlos, solo consumirlos

10. ✅ **Cerrar sesión (Logout)**
   - ✅ Agregar botón de "Cerrar sesión" en el header (`src/js/main.js`) o en la vista de mi-cuenta
   - ✅ Al hacer clic: borrar `token` y `usuarioActivo` de `localStorage`, redirigir a `src/tienda/login/index.html`
   - ✅ Validar que el botón solo se muestre cuando hay sesión activa

11. ✅ **Header que refleje el estado de autenticación**
    - ✅ Editar VISTA `src/js/main.js` para leer `usuarioActivo` y mostrar el nombre del usuario logueado
    - ✅ Definir `APP_BASE` en `src/js/main.js` (`window.APP_BASE || window.location.origin`) para construir URLs absolutas de login y mi-cuenta (ya definido también en `src/js/ui.js`)
    - ✅ Mostrar/ocultar enlaces según el estado de autenticación (ej. "Mi cuenta" vs "Iniciar sesión")
    - ✅ Mostrar/ocultar enlaces de administración según el rol (`ADMIN`/`STAFF` vs `CUSTOMER`)
    - ✅ Al cerrar sesión: borrar `token` y `usuarioActivo` de `localStorage`, redirigir a `src/tienda/login/index.html`

**Entrega del Rol A (Parte 1):** Pull request parcial o rama lista con `src/api/` funcional, login y registro integrados, y vista de login del admin creada.

---

## <a name="rol-b-naya-integracion-de-catalogo-y-detalle-de-productos"></a>Rol B (Naya) — Integración de Catálogo, Detalle y Carrito (Dificultad: 3/5)

**Objetivo:** Que la tienda muestre productos reales del backend, que el detalle funcione y que el carrito esté listo para conectarse al checkout del Rol C.

### Tareas

1. ✅ **Implementar `src/api/services/productos.service.js`**
   - ✅ `obtenerTodas()` → `GET /api/productos`
   - ✅ `obtenerPorId(id)` → `GET /api/productos/{id}`
   - ✅ `obtenerPorSlug(slug)` → `GET /api/productos/slug/{slug}`
   - ✅ `obtenerPorCategoria(categoria)` → `GET /api/productos?categoria=...`
   - ✅ `obtenerDisponibles()` → `GET /api/productos?disponibles=true`

2. ✅ **Conectar VISTA `src/js/productos.js`** (o `src/js/velas.js`)
   - ✅ Reemplazar `fetch(productos.json)` por llamada al service
   - ✅ Mantener `window.productos` y evento `productos-listadas` como puente temporal

3. ✅ **Conectar VISTA `src/tienda/catalogo/catalogo.js`**
   - ✅ Cargar productos desde la API al entrar
   - ✅ Seguir filtrando/ordenando en el front

4. ✅ **Conectar VISTA `src/tienda/catalogo/producto/producto.js`**
   - ✅ Buscar por `slug` en el módulo de productos
   - ✅ Mostrar estado "no encontrado" si no existe

5. ✅ **Preparar carrito de compras (VISTA `src/js/carrito.js`) para el Rol C**
   - ✅ Leer y escribir `lumina-carrito` en `localStorage` (array de `{ productId, quantity }`)
   - ✅ Funciones: `agregarAlCarrito(id)`, `cambiarCantidad(id, delta)`, `eliminarItem(id)`, `vaciarCarrito()`, `obtenerProductosCarrito()` (equivalente a `obtenerCarrito()`)
   - ✅ Calcular totales locales (subtotal, IVA 19%, total) como referencia visual
   - ✅ **No conectar aún al backend de pedidos** — el Rol C hará el `POST /api/pedidos` usando estos items

6. ✅ **Deprecar JSON estático**
   - ✅ Dejar de usar `productos.json` / `velas.json` en runtime

**Entrega del Rol B:** PR con catálogo, detalle y carrito funcionando (carrito en localStorage, listo para que el Rol C lo consuma en el checkout).

---

## <a name="rol-c-nicole-integracion-de-autenticacion-y-pedidos"></a>Rol C (Nicole) — Integración de Autenticación y Pedidos (Checkout + Mis Pedidos) (Dificultad: 3/5)

**Objetivo:** Que registro, login, checkout y "mis pedidos" usen el backend real.

### Tareas

1. ✅ **Implementar `src/api/services/usuarios.service.js`**
   - ✅ `registrar(data)` → `POST /api/registro`
   - ✅ `login(data)` → `POST /api/login`
   - ✅ `obtenerUsuario(id)` → `GET /api/usuarios/{id}`
   - ✅ `actualizarUsuario(id, data)` → `PUT /api/usuarios/{id}`

2. ✅ **Implementar `src/api/services/pedidos.service.js`**
   - ✅ `crearPedido(data)` → `POST /api/pedidos`
   - ✅ `listarPedidosPorUsuario(usuarioId)` → `GET /api/pedidos?usuarioId=`
   - ✅ `actualizarEstado(id, estado)` → `PUT /api/pedidos/{id}/estado`

3. ✅ **Conectar VISTA `src/componentes/checkout-modal/checkout-modal.js`**
   - ✅ Validar que exista sesión (`usuarioActivo.id`); si no, redirigir al login
   - ✅ Llamar `POST /api/pedidos` en lugar de generar `L-####` y guardar en `localStorage`
   - ✅ Mostrar totales del `OrderResponse` del backend
   - ✅ Enviar `couponCode` si aplica

4. ✅ **Conectar VISTA `src/tienda/mi-cuenta/pedidos/pedidos.js`**
   - ✅ Llamar `GET /api/pedidos?usuarioId=`
   - ✅ Renderizar usando el mapa de estados (PENDING → Pendiente, etc.)
   - ✅ Dejar de mezclar `pedidos.json` con `lumina-pedidos`

5. ✅ **Conectar VISTA `src/js/main.js` y VISTA `src/tienda/mi-cuenta/info/`**
   - ✅ Leer `usuarioActivo` con `fullName`, `phone`, `email`
   - ✅ Eliminar bloque de contraseña en "Mi cuenta"

6. ✅ **Proteger vistas de mi-cuenta contra acceso no autenticado**
   - ✅ Llamar a `requireAuth(['CUSTOMER', 'ADMIN', 'STAFF'])` al inicio de VISTA `src/tienda/mi-cuenta/info/`, VISTA `src/tienda/mi-cuenta/pedidos/` y VISTA `src/tienda/mi-cuenta/favoritos/`
   - ✅ Si no hay sesión activa, redirigir a `src/tienda/login/index.html`
   - ✅ Reutilizar `src/api/authGuard.js` creado en el Rol A

**Entrega del Rol C:** PR con autenticación, checkout y mis pedidos funcionando contra el backend.

---

## <a name="rol-d-pedro-integracion-del-panel-de-administracion"></a>Rol D (Pedro) — Integración del Panel de Administración (CRUD Productos) (Dificultad: 4/5)

**Objetivo:** Que el admin gestione productos reales a través del backend.

### Tareas

1. ✅ **Conectar VISTA `src/admin/productos/productos.js`**
   - ✅ Cargar `GET /api/productos` al entrar
   - ✅ Renderizar todos los productos (no solo los de `localStorage`)

2. ✅ **Conectar VISTA `src/admin/producto-formulario/producto-formulario.js`**
   - ✅ `POST /api/productos` con payload adaptado
   - ✅ Agregar campos faltantes: `stock` (requerido) y `available` (checkbox, default `true`)
   - ✅ Usar el `value` del `<select>` de categoría, no el `textContent`

3. ✅ **Agregar botón Editar por producto**
   - ✅ Abrir modal precargado
   - ✅ Llamar `PUT /api/productos/{id}`

4. ✅ **Agregar botón Eliminar por producto**
   - ✅ Llamar `DELETE /api/productos/{id}` con confirmación
   - ✅ Manejar error `409` (producto con dependencias)

5. ✅ **Conectar VISTA `src/admin/producto-detalle/producto-detalle.js`**
   - ✅ Cargar `GET /api/productos/{id}` al entrar
   - ✅ Mostrar todos los campos del producto (incluyendo `stock`, `available`, `description`)
   - ✅ Mostrar botones de editar y eliminar

6. ✅ **Manejo de errores**
   - ✅ Mapear `ApiError.details` a los campos del formulario

7. ✅ **Eliminar lógica obsoleta**
   - ✅ Eliminar `lumina-productos` de `localStorage` y su mezcla en el módulo de productos

8. ✅ **Proteger vistas del panel de administración**
   - ✅ Agregar `<script type="module">` con `import { requireAuth } from "../../api/authGuard.js"; requireAuth(["ADMIN", "STAFF"]);` al inicio de cada vista del admin:
     - ✅ `src/admin/productos/index.html`
     - ✅ `src/admin/producto-detalle/index.html`
   - ✅ Si no hay sesión activa o el rol no es `ADMIN`/`STAFF`, redirigir a `src/tienda/login/index.html`
   - ✅ Reutilizar `src/api/authGuard.js` creado en el Rol A

**Entrega del Rol D:** ✅ PR con admin CRUD funcionando contra el backend y todas las vistas protegidas contra acceso no autorizado.

---

## <a name="rol-a-argie-parte-2-unificacion-y-merge"></a>Rol A (Argie) — Parte 2: Unificación y Merge (Dificultad: 5/5)

**Objetivo:** Unir los avances de B, C y D en la rama base, verificar que todo junto funcione, y hacer el PR a `main`.

### Tareas

1. **Crear rama de integración**
   - `git switch main && git pull`
   - `git switch -c feature/integracion-completa`

2. **Traer los PR de los Roles B, C y D**
   - Mergear en orden: B → C → D (o según dependencias)
   - Resolver conflictos si los hay

3. **Verificación final**
   - Arrancar frontend con Live Server en `http://localhost:5500` **o** `npx serve` en el puerto deseado, y backend en `http://localhost:8080`
   - Ejecutar smoke test end-to-end:
     - Registro → login → ver productos → agregar al carrito → checkout → ver pedido en "Mis pedidos"
     - Login como ADMIN → crear/editar/eliminar producto → verse en tienda
   - Verificar CORS y tokens Bearer en peticiones protegidas

4. **Limpiar `localStorage` / JSON obsoletos** (Fase 5 del documento)
   - `lumina-productos`, `lumina-pedidos`, `usuarios`, `usuarioActivo` (si ya no se usan)

5. **Manejo automático de token expirado (401)**
   - En `src/api/client.js`, agregar interceptores de respuesta que detecten código 401
   - Al recibir 401: borrar `token` y `usuarioActivo` de `localStorage`, redirigir a `src/tienda/login/index.html`
   - Mostrar mensaje genérico de "Sesión expirada, inicia sesión nuevamente"
   - Probar que el flujo de expiración funcione en el smoke test

6. **Hacer commit y push**
   - `git add . && git commit -m "feat(integracion): front-back completo"`
   - `git push origin feature/integracion-completa`

7. **Abrir Pull Request hacia `main`**
   - Revisar que todos los checks del checklist de aceptación (`INTEGRACION_API.md` sección 9) pasen
   - Mergear a `main`

---

## Orden recomendado de trabajo

1. **Rol A** termina la Parte 1 y avisa que la base está lista.
2. **Roles B, C, D** trabajan en paralelo sobre la base del Rol A.
3. **Rol A** hace la unificación final una vez que B, C y D terminaron sus PRs.
4. **Smoke test final** y merge a `main`.

---

## Escala de dificultad

- **1 (Muy fácil):** Configuración simple, pocos archivos, lógica directa.
- **2 (Fácil):** Creación de archivos nuevos con lógica estándar, sin dependencias complejas.
- **3 (Media):** Integración de servicios existentes, reemplazo de datos estáticos por API, manejo de respuestas.
- **4 (Difícil):** Múltiples endpoints, manejo de sesiones/tokens, validaciones de negocio, manejo de errores complejos.
- **5 (Muy difícil):** Unificación de múltiples ramas, resolución de conflictos, smoke test end-to-end, merge a `main`.
