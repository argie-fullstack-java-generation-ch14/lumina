# Plan de Integración Front-Back — Lumina

**Backend:** `http://localhost:8080/api/...` (Spring Boot 3, MySQL, JWT implementado)  
**Frontend:** `lumina/` (HTML/CSS/JS puro, Live Server)  
**Rama sugerida:** `feature/integracion-front-back` (desde `main`)  

---

## Rol A (Argie) — Parte 1: Bases de integración ⭐⭐ (Dificultad: 2/5)

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
   - Correr Live Server en `http://localhost:5500`
   - Confirmar que CORS funciona con el backend

**Entrega del Rol A (Parte 1):** Pull request parcial o rama lista con `src/api/` funcional y login integrado.

---

## Rol B — Integración de Catálogo y Detalle de Productos ⭐⭐⭐ (Dificultad: 3/5)

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

## Rol C — Integración de Autenticación y Pedidos (Checkout + Mis Pedidos) ⭐⭐⭐⭐ (Dificultad: 4/5)

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

**Entrega del Rol C:** PR con autenticación, checkout y mis pedidos funcionando contra el backend.

---

## Rol D — Integración del Panel de Administración (CRUD Productos) ⭐⭐⭐⭐ (Dificultad: 4/5)

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

## Rol A (Argie) — Parte 2: Unificación y Merge ⭐⭐⭐⭐⭐ (Dificultad: 5/5)

**Objetivo:** Unir los avances de B, C y D en la rama base, verificar que todo junto funcione, y hacer el PR a `main`.

### Tareas

1. **Crear rama de integración**
   - `git switch main && git pull`
   - `git switch -c feature/integracion-completa`

2. **Traer los PR de los Roles B, C y D**
   - Mergear en orden: B → C → D (o según dependencias)
   - Resolver conflictos si los hay

3. **Verificación final**
   - Arrancar frontend con Live Server y backend en `http://localhost:8080`
   - Ejecutar smoke test end-to-end:
     - Registro → login → ver productos → agregar al carrito → checkout → ver pedido en "Mis pedidos"
     - Login como ADMIN → crear/editar/eliminar producto → verse en tienda
   - Verificar CORS y tokens Bearer en peticiones protegidas

4. **Limpiar `localStorage` / JSON obsoletos** (Fase 5 del documento)
   - `lumina-productos`, `lumina-pedidos`, `usuarios`, `usuarioActivo` (si ya no se usan)

5. **Hacer commit y push**
   - `git add . && git commit -m "feat(integracion): front-back completo"`
   - `git push origin feature/integracion-completa`

6. **Abrir Pull Request hacia `main`**
   - Revisar que todos los checks del checklist de aceptación (`INTEGRACION_API.md` sección 9) pasen
   - Mergear a `main`

---

## Resumen de entregables por Rol

| Rol | Fase | Archivos clave | Dificultad |
|-----|------|----------------|------------|
| **A (Parte 1)** | Base + Login | `src/api/client.js`, `src/api/endpoints.js`, `src/api/adapters.js`, `src/tienda/login/login.js` | 2/5 |
| **B** | Catálogo | `src/api/services/productos.service.js`, `src/js/productos.js`, `src/tienda/catalogo/` | 3/5 |
| **C** | Auth + Pedidos | `src/api/services/usuarios.service.js`, `src/api/services/pedidos.service.js`, `src/tienda/registro/`, `src/componentes/checkout-modal/`, `src/tienda/mi-cuenta/pedidos/` | 4/5 |
| **D** | Admin | `src/admin/productos/`, `src/admin/producto-formulario/` | 4/5 |
| **A (Parte 2)** | Unificación | Rama `feature/integracion-completa`, PR a `main`, smoke test final | 5/5 |

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
