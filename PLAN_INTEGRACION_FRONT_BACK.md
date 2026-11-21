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
| [**A (Argie, Parte 1)**](#rol-a-argie-parte-1-bases-de-integracion) | Base + Login | `src/api/client.js`, `src/api/endpoints.js`, `src/api/adapters.js`, `src/api/authGuard.js`, `src/tienda/login/login.js`, `src/tienda/registro/registro.js` | 2/5 |
| [**B (Naya)**](#rol-b-naya-integracion-de-catalogo-y-detalle-de-productos) | Catálogo | `src/api/services/productos.service.js`, `src/js/productos.js`, `src/tienda/catalogo/` | 3/5 |
| [**C (Nicole)**](#rol-c-nicole-integracion-de-autenticacion-y-pedidos) | Auth + Pedidos | `src/api/services/usuarios.service.js`, `src/api/services/pedidos.service.js`, `src/tienda/registro/`, `src/componentes/checkout-modal/`, `src/tienda/mi-cuenta/pedidos/` | 4/5 |
| [**D (Pedro)**](#rol-d-pedro-integracion-del-panel-de-administracion) | Admin | `src/admin/productos/`, `src/admin/producto-formulario/` | 4/5 |
| [**A (Argie, Parte 2)**](#rol-a-argie-parte-2-unificacion-y-merge) | Unificación | Rama `feature/integracion-completa`, PR a `main`, smoke test final | 5/5 |

---

## <a name="rol-a-argie-parte-1-bases-de-integracion"></a>Rol A (Argie) — Parte 1: Bases de integración (Dificultad: 2/5)

**Objetivo:** Dejar lista la infraestructura mínima para que los demás roles solo conecten vistas con APIs, sin preocuparse por configuración de red, base URL o manejo de errores.

### Tareas

1. **Crear `src/api/client.js`**
   - Constante `API_BASE_URL` (default `http://localhost:8080`, sobreescribible por `window.LUMINA_API_URL` o variable de entorno)
   - Funciones genéricas `apiGet`, `apiPost`, `apiPut`, `apiDelete`
   - Headers JSON automáticos
   - Inyección opcional del token `Authorization: Bearer <token>` desde `localStorage`
   - Parseo centralizado de errores `ApiError` (`{ status, error, message, details, timestamp }`)

2. **Crear `src/api/endpoints.js`**
   - Centralizar todas las rutas del backend:
     - `/api/productos`, `/api/productos/{id}`, `/api/productos/slug/{slug}`
     - `/api/registro`, `/api/login`
     - `/api/usuarios/{id}`
     - `/api/pedidos`, `/api/pedidos?usuarioId=`, `/api/pedidos/{id}/estado`

3. **Crear `src/api/adapters.js`**
   - Funciones de mapeo backend → front y front → backend
   - Mapeo de estados de pedido: `PENDING` → `Pendiente`, `CONFIRMED` → `Confirmado`, etc.
   - Mapeo de usuario: `fullName` ↔ `nombreCompleto`, `phone` ↔ `telefono`
   - Función para extraer `orderNumber` como `numeroOrden`

4. **Preparar la vista de login para administración**
   - `src/tienda/login/login.js`: llamar `POST /api/login` con `{ email, password }`
   - Al éxito: guardar `token` y `user` (sin contraseña) en `localStorage`
   - Redireccionar al panel de administración si el rol es `ADMIN` o `STAFF`; si es `CUSTOMER`, redirigir a tienda
   - Mostrar error genérico 401 sin revelar si el correo existe

5. **Verificar compilación/arranque del front**
   - Correr Live Server en `http://localhost:5500` **o** `npx serve` en el puerto deseado (ej. `npx serve -l 3000`)
   - Confirmar que CORS funciona con el backend

6. **Proteger vistas del administración contra acceso no autorizado**
   - Crear `src/api/authGuard.js` con función `requireAuth(rolesPermitidos)`
   - Verificar que exista `token` en `localStorage` y que el rol del `usuarioActivo` esté en `rolesPermitidos` (ej. `['ADMIN', 'STAFF']`)
   - Si no hay sesión o el rol no autoriza, redirigir a `src/tienda/login/index.html`
   - Llamar a `requireAuth(['ADMIN', 'STAFF'])` al inicio de cada vista del panel de administración

7. **Conectar la página de registro al backend**
   - Editar `src/tienda/registro/registro.js`
   - Llamar `apiPost(endpoints.auth.register, { fullName, phone, email, password })`
   - Al éxito: guardar `UserResponse` en `usuarioActivo` (sin contraseña), redirigir según rol
   - Mostrar errores de validación (`400`, `409`) en el formulario correspondiente

**Entrega del Rol A (Parte 1):** Pull request parcial o rama lista con `src/api/` funcional, login y registro integrados.

---

## <a name="rol-b-naya-integracion-de-catalogo-y-detalle-de-productos"></a>Rol B (Naya) — Integración de Catálogo y Detalle de Productos (Dificultad: 3/5)

**Objetivo:** Que la tienda muestre productos reales del backend en lugar de JSON estático.

### Tareas

1. **Implementar `src/api/services/productos.service.js`**
   - `obtenerTodas()` → `GET /api/productos`
   - `obtenerPorId(id)` → `GET /api/productos/{id}`
   - `obtenerPorSlug(slug)` → `GET /api/productos/slug/{slug}`
   - `obtenerPorCategoria(categoria)` → `GET /api/productos?categoria=...`
   - `obtenerDisponibles()` → `GET /api/productos?disponibles=true`

2. **Conectar `src/js/productos.js`** (o `src/js/velas.js`)
   - Reemplazar `fetch(productos.json)` por llamada al service
   - Mantener `window.productos` y evento `productos-listadas` como puente temporal

3. **Conectar `src/tienda/catalogo/catalogo.js`**
   - Cargar productos desde la API al entrar
   - Seguir filtrando/ordenando en el front

4. **Conectar `src/tienda/catalogo/producto/producto.js`**
   - Buscar por `slug` en el módulo de productos
   - Mostrar estado "no encontrado" si no existe

5. **Deprecar JSON estático**
   - Dejar de usar `productos.json` / `velas.json` en runtime

**Entrega del Rol B:** PR con catálogo y detalle funcionando contra el backend.

---

## <a name="rol-c-nicole-integracion-de-autenticacion-y-pedidos"></a>Rol C (Nicole) — Integración de Autenticación y Pedidos (Checkout + Mis Pedidos) (Dificultad: 4/5)

**Objetivo:** Que registro, login, checkout y "mis pedidos" usen el backend real.

### Tareas

1. **Implementar `src/api/services/usuarios.service.js`**
   - `registrar(data)` → `POST /api/registro`
   - `login(data)` → `POST /api/login`
   - `obtenerUsuario(id)` → `GET /api/usuarios/{id}`
   - `actualizarUsuario(id, data)` → `PUT /api/usuarios/{id}`

2. **Implementar `src/api/services/pedidos.service.js`**
   - `crearPedido(data)` → `POST /api/pedidos`
   - `listarPedidosPorUsuario(usuarioId)` → `GET /api/pedidos?usuarioId=`
   - `actualizarEstado(id, estado)` → `PUT /api/pedidos/{id}/estado`

3. **Conectar `src/tienda/registro/registro.js`**
   - Llamar al service de registro
   - Al éxito: guardar `UserResponse` en `usuarioActivo` (sin contraseña)
   - Redirigir según rol

4. **Conectar `src/componentes/checkout-modal/checkout-modal.js`**
   - Validar que exista sesión (`usuarioActivo.id`); si no, redirigir al login
   - Llamar `POST /api/pedidos` en lugar de generar `L-####` y guardar en `localStorage`
   - Mostrar totales del `OrderResponse` del backend
   - Enviar `couponCode` si aplica

5. **Conectar `src/tienda/mi-cuenta/pedidos/pedidos.js`**
   - Llamar `GET /api/pedidos?usuarioId=`
   - Renderizar usando el mapa de estados (PENDING → Pendiente, etc.)
   - Dejar de mezclar `pedidos.json` con `lumina-pedidos`

6. **Conectar `src/js/main.js` y `src/tienda/mi-cuenta/info/`**
   - Leer `usuarioActivo` con `fullName`, `phone`, `email`
   - Eliminar bloque de contraseña en "Mi cuenta"

7. **Proteger vistas de mi-cuenta contra acceso no autenticado**
   - Llamar a `requireAuth(['CUSTOMER', 'ADMIN', 'STAFF'])` al inicio de `src/tienda/mi-cuenta/info/`, `src/tienda/mi-cuenta/pedidos/` y `src/tienda/mi-cuenta/favoritos/`
   - Si no hay sesión activa, redirigir a `src/tienda/login/index.html`
   - Reutilizar `src/api/authGuard.js` creado en el Rol A

8. **Nota sobre el carrito de compras**
   - El carrito permanece en `localStorage` y NO se asocia a la sesión del usuario ni al backend.
   - Funciona como carrito de invitado: se puede agregar productos sin iniciar sesión.
   - Al hacer checkout (`POST /api/pedidos`), se envía el `userId` del usuario autenticado. Si no hay sesión, el frontend debe solicitar login o registro antes de finalizar la compra.
   - El carrito se pierde si el usuario limpia el `localStorage`, cambia de navegador o de dispositivo.

9. **Cerrar sesión (Logout)**
   - Agregar botón de "Cerrar sesión" en el header (`src/js/main.js`) o en la vista de mi-cuenta
   - Al hacer clic: borrar `token` y `usuarioActivo` de `localStorage`, redirigir a `src/tienda/login/index.html`
   - Validar que el botón solo se muestre cuando hay sesión activa

10. **Header que refleje el estado de autenticación**
    - Editar `src/js/main.js` para leer `usuarioActivo` y mostrar el nombre del usuario logueado
    - Mostrar/ocultar enlaces según el estado de autenticación (ej. "Mi cuenta" vs "Iniciar sesión")
    - Mostrar/ocultar enlaces de administración según el rol (`ADMIN`/`STAFF` vs `CUSTOMER`)

**Entrega del Rol C:** PR con autenticación, checkout, mis pedidos, logout y header con estado de autenticación funcionando contra el backend.

---

## <a name="rol-d-pedro-integracion-del-panel-de-administracion"></a>Rol D (Pedro) — Integración del Panel de Administración (CRUD Productos) (Dificultad: 4/5)

**Objetivo:** Que el admin gestione productos reales a través del backend.

### Tareas

1. **Conectar `src/admin/productos/productos.js`**
   - Cargar `GET /api/productos` al entrar
   - Renderizar todos los productos (no solo los de `localStorage`)

2. **Conectar `src/admin/producto-formulario/producto-formulario.js`**
   - `POST /api/productos` con payload adaptado
   - Agregar campos faltantes: `stock` (requerido) y `available` (checkbox, default `true`)
   - Usar el `value` del `<select>` de categoría, no el `textContent`

3. **Agregar botón Editar por producto**
   - Abrir modal precargado
   - Llamar `PUT /api/productos/{id}`

4. **Agregar botón Eliminar por producto**
   - Llamar `DELETE /api/productos/{id}` con confirmación
   - Manejar error `409` (producto con dependencias)

5. **Manejo de errores**
   - Mapear `ApiError.details` a los campos del formulario

6. **Eliminar lógica obsoleta**
   - Eliminar `lumina-productos` de `localStorage` y su mezcla en el módulo de productos

**Entrega del Rol D:** PR con admin CRUD funcionando contra el backend.

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

6. **Abrir Pull Request hacia `main`**
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
