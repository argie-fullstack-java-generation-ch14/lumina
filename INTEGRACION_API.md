# Plan de integración Front — Backend Lumina

**Estado:** propuesto.  
**Front:** `lumina/` (HTML/CSS/JS puro, Live Server).  
**Backend:** `lumina-backend/` (Spring Boot 3, H2/MySQL, API REST).

Este documento describe los ajustes que debe hacer el **frontend** para consumir la API del backend y quedar consistente con sus respuestas. Las rutas y la lógica del backend ya están definidas; aquí se adapta el front al contrato de la API, no al revés.

---

## 1. Alcance y fuera de alcance

### Dentro del alcance

| Dominio | Qué se integra |
|---|---|
| Catálogo | Productos y detalle por slug |
| Autenticación | Registro, login y sesión de usuario |
| Pedidos | Carrito, checkout y mis pedidos del usuario autenticado |
| Administración | CRUD de productos |

### Fuera de alcance

| Dominio | Motivo |
|---|---|
| Blog / artículos | El backend no tiene endpoints de artículos (`articulos.json` solo en front) |
| Velas personalizadas | El backend tiene `/api/velas-personalizadas` pero el front no tiene módulo que lo consuma |
| Pasarela de pagos real | Checkout solo genera solicitud de confirmación, no cobra |
| Autenticación JWT | Pendiente del Rol E; la sesión sigue en `localStorage` (`usuarioActivo`) |
| Protección de rutas de administración | El admin queda abierto mientras no haya JWT |

---

## 2. Estado actual vs backend

### Datos que usa hoy el front
- Catálogo: `src/data/velas.json` cargado por `src/js/velas.js`.
- Carrito y favoritos: `localStorage` (`lumina-carrito`, `lumina-favoritos`).
- Usuarios: `localStorage` (`usuarios`, `usuarioActivo`), con contraseña en texto plano.
- Productos creados desde el admin: `localStorage` (`lumina-productos`).
- Pedidos: `localStorage` (`lumina-pedidos`) mezclado con `src/data/pedidos.json`.

### Capa API del front hoy
Los archivos de `src/api/` son solo esqueletos con comentarios:
- `src/api/client.js`
- `src/api/endpoints.js`
- `src/api/services/velas.service.js`
- `src/api/services/articulos.service.js`

Ninguno hace llamadas reales.

---

## 3. Capa API del front (implementar)

Implementar en `src/api/`:

| Archivo | Responsabilidad |
|---|---|
| `client.js` | Constante `API_BASE_URL` (ej. `http://localhost:8080`), funciones genéricas `apiGet/Post/Put/Delete`, headers JSON y parseo centralizado de errores `ApiError`. |
| `endpoints.js` | Centralizar rutas del backend. |
| `velas.service.js` | Reutilizar para productos del catálogo: `GET /api/productos`, `GET /api/productos/slug/{slug}`. |
| `usuarios.service.js` | `POST /api/registro`, `POST /api/login`, `GET /api/usuarios/{id}`, `PUT /api/usuarios/{id}`. |
| `pedidos.service.js` | `POST /api/pedidos`, `GET /api/pedidos?usuarioId=`, `PUT /api/pedidos/{id}/estado`. |
| `adapters.js` | Funciones de mapeo backend → front y front → backend. |

**Configuración de host:** `API_BASE_URL` debe poder sobrescribirse (variable de entorno o `window.LUMINA_API_URL`). Hoy el backend permite CORS en `http://localhost:5500`, `http://127.0.0.1:5500` y GitHub Pages.

---

## 4. Matriz de adaptación de datos

### Producto

| Campo backend (`Product` / DTO) | Campo front (actual) | Ajuste |
|---|---|---|
| `id` | `id` | sin cambio |
| `name` | `name` | sin cambio |
| `slug` | `slug` | sin cambio |
| `imageUrl` | `img` | front usa `imageUrl` del backend |
| `category` | `category` | ver sección de categorías |
| `scent` | `scent` | sin cambio |
| `weightGrams` | `weight` | front usa `weightGrams` |
| `color` | `color` | sin cambio |
| `description` | `description` | sin cambio |
| `price` (BigDecimal) | `price` (number) | parsear a número para `toLocaleString("es-CO")` |
| `stock` | — | nuevo campo; mostrar disponibilidad |
| `available` | — | nuevo campo; desactivar "Agregar al carrito" si `false` o `stock = 0` |

### Categorías
El backend devuelve el texto de la categoría tal cual (ej. `bienestar`, `navidad`, `Amor propio`).
- `value` = texto recibido del backend.
- `label` = texto con primera letra en mayúscula para mostrar al usuario.
- Clase CSS (`category-*`) = normalizar el texto: minúsculas, sin tildes, espacios→guiones. Actualizar `obtenerClaseCategoria` en `src/js/velas.js` para que sea insensible a mayúsculas/tildes en lugar de depender de claves con mayúscula.

### Usuario

| Campo backend (`UserResponse`) | Campo front (actual) | Ajuste |
|---|---|---|
| `id` | `id` | sin cambio |
| `fullName` | `nombreCompleto` | mapear |
| `phone` | `telefono` | mapear |
| `email` | `email` | sin cambio |
| `role` | `rol` | nuevo |
| `createdAt` | `fechaRegistro` | nuevo |

**Nunca guardar ni mostrar la contraseña en el front.** El backend no la devuelve en `UserResponse`.

### Pedidos

| Campo backend (`OrderResponse`) | Campo front (actual) | Ajuste |
|---|---|---|
| `id` | `id` / `numeroOrden` | usar `orderNumber` del backend |
| `status` (enum `PENDING`, `CONFIRMED`, ...) | `estado` (`PENDIENTE`) | ver tabla de estados |
| `subtotal`, `discountTotal`, `taxTotal`, `total` | `totales` | usar valores del backend |
| `createdAt` | `fecha` | formatear desde el backend |
| `items[].productId` / `productName` / `unitPrice` / `quantity` / `lineTotal` | `productos[]` | `productName`/`unitPrice` sí; `img`, `scent`, `weight`, `color` **no vienen**; resolver contra el catálogo por `productId` o usar fallback |

**Estados de pedido:**

| Valor backend (`value`) | Label front para mostrar |
|---|---|
| `PENDING` | Pendiente |
| `CONFIRMED` | Confirmado |
| `PREPARING` | En preparación |
| `COMPLETED` | Completado |
| `CANCELLED` | Cancelado |

---

## 5. Ajustes por módulo del front

### 5.1 Catálogo, home, detalle y componentes que consumen velas
- **Coherencia de nombres:** `src/js/velas.js` se ajusta al dominio del backend y pasa a llamarse `src/js/productos.js` (o se mantiene el nombre de archivo pero se trata como capa de productos genérica). No importa el nombre del archivo, lo importante es que el módulo deje de ser específico de "velas" y se convierta en una capa de productos genérica (`src/js/productos.js` o equivalente) que consuma `GET /api/productos`.
- El módulo de productos reemplaza el `fetch` a `src/data/velas.json` por `GET /api/productos`.
- Mantener `window.velas`, el evento `velas-listadas` y las exportaciones `velas` y `obtenerClaseCategoria` **solo como puente temporal** para no romper `catalogo.js`, `favoritos.js`, `carrito.js`, `productos-recomendados.js` y `carrusel.js`. A mediano plazo, esos consumidores deben importar directamente desde el módulo de productos en lugar de depender de `window.velas`.
- `src/tienda/catalogo/catalogo.js`: cargar todos los productos una vez y seguir filtrando/ordenando en el front (o usar `?categoria=` y `disponibles=true` del backend como optimización posterior).
- `src/tienda/catalogo/producto/producto.js`: buscar por `slug` en el módulo de productos; si no existe, mostrar estado "no encontrado" en lugar de caer al primer producto.
- `velas.json`: dejar de usarse en runtime; mantener solo como referencia hasta que se verifique la integración, luego eliminar.

### 5.2 Autenticación
- `src/tienda/registro/registro.js`: `POST /api/registro` con payload `{ fullName, phone, email, password }`. Al éxito, guardar `UserResponse` mapeado en `usuarioActivo`. Eliminar escritura en `usuarios` y no almacenar contraseña.
- `src/tienda/login/login.js`: `POST /api/login` con `{ email, password }`. No validar contraseña localmente; usar el resultado del backend. Eliminar lectura del array `usuarios`.
- `src/js/main.js` (header): leer `usuarioActivo` ya mapeado (`nombreCompleto`).
- `src/tienda/mi-cuenta/info/index.html` + `info.js`: eliminar el bloque de contraseña (el backend no la devuelve). Mostrar nombre, correo y teléfono. Si se requiere edición futura, usar `PUT /api/usuarios/{id}` con `{ fullName, phone }`.

### 5.3 Carrito, checkout y mis pedidos
- **Checkout** (`src/componentes/checkout-modal/checkout-modal.js`): validar que exista sesión (`usuarioActivo.id`); si no hay sesión, redirigir al login o mostrar mensaje. En lugar de generar `L-####` y guardar en `localStorage`, llamar `POST /api/pedidos` con `{ userId, items: [{ productId, quantity }] }`.
- Construir el pedido para mostrar al usuario usando `OrderResponse`:
  - `numeroOrden` = `orderNumber` del backend (formato `LUM-000001`).
  - `fecha` = formatear `createdAt`.
  - `estado` = valor backend + label del mapa de estados.
  - `productos` = resolver cada `item.productId` contra `velas` para obtener `name`, `img`, `scent`, `weight`, `color`; fallback si no se encuentra.
  - `totales` = `subtotal`, `discountTotal`, `taxTotal`, `total` del backend.
- `src/tienda/mi-cuenta/pedidos/pedidos.js`: dejar de mezclar `pedidos.json` con `lumina-pedidos`. Llamar `GET /api/pedidos?usuarioId=` y renderizar usando el mapa de estados y el resumen del backend.
- **Guardado temporal:** mientras se valida, se puede seguir usando `lumina-pedidos` como caché visual, pero la fuente de verdad es la API.

### 5.4 Panel de administración (CRUD completo)
`src/admin/productos/productos.js` + `src/admin/producto-formulario/`:

- Cargar `GET /api/productos` al entrar y renderizar todos los productos (no solo los de `localStorage`).
- Crear: `POST /api/productos` con payload adaptado. Agregar al formulario los campos que faltan: `stock` (requerido) y `available` (checkbox, por defecto `true`). Usar el `value` del `<select>` de categoría (ya es el texto del backend) y no el `textContent`.
- Editar: añadir botón por producto, abrir el modal precargado y llamar `PUT /api/productos/{id}`.
- Eliminar: `DELETE /api/productos/{id}` con confirmación y manejo de `409` (producto con dependencias).
- Manejo de errores: mapear `ApiError.details` a los campos del formulario.
- Eliminar la lógica de `lumina-productos` y su mezcla en `src/js/velas.js`; el admin y la tienda leen de la misma API.

---

## 6. IVA, cupones y descuentos (decisión coordinada con backend)

**Estado:** el backend ya implementa el cálculo de totales en `OrderService.create()`. Mientras el front no consuma esos valores, su cálculo local (IVA 19 % y cupón `LUMINA26` con 10 %) sirve como referencia visual, pero deja de ser la fuente de verdad.

**Implementado en el backend:**
- `OrderRequest` recibe un campo opcional `couponCode`.
- `OrderService` valida el cupón y falla con `400` si no existe. `LUMINA26` aplica un 10 % sobre el subtotal.
- El IVA (19 %) se calcula sobre la base neta (`subtotal - descuento`), con redondeo a peso entero (`HALF_UP`), igual que el cálculo previo del front.
- `OrderResponse` ya devuelve `subtotal`, `discountTotal`, `taxTotal` y `total` calculados con el cupón aplicado.
- Sin cupón (`couponCode` nulo o vacío) el descuento es `0`.

**Pendiente en el front:**
- Dejar de calcular IVA y descuentos localmente y mostrar los valores de `OrderResponse`.
- Enviar `couponCode` dentro del cuerpo de `POST /api/pedidos`.
- Recordatorio: el proyecto no compila hasta que se complete el Rol D (mover controladores y DTOs de salida), por lo que la verificación end-to-end queda para después de esa tarea.

---

## 7. Manejo de errores y estados de UI

El cliente API debe lanzar errores con la forma:
```ts
{ status: number, error: string, message: string, details: string[], timestamp: string }
```

Comportamientos mínimos:
- `400`: mostrar `details` de validación en el formulario correspondiente.
- `401`: login fallido; mostrar mensaje genérico sin indicar si existe el correo.
- `404`: producto/pedido/usuario no encontrado; mostrar "no encontrado".
- `409`: duplicado (email o slug de producto) o producto con dependencias al borrar.
- `500`: mensaje genérico de error del servidor.
- Carga vacía/error: estados "sin resultados" y "error al cargar" en catálogo, admin y pedidos.

---

## 8. Fases de implementación

| Fase | Qué se hace |
|---|---|
| **0** | Crear `client.js`, `endpoints.js`, services y `adapters.js`. |
| **1** | Conectar catálogo y detalle a `GET /api/productos`; deprecian `velas.json`. |
| **2** | Conectar registro/login y actualizar header, registro, login y mi cuenta. |
| **3** | Conectar checkout con `POST /api/pedidos` y `mis pedidos` con `GET /api/pedidos`. |
| **4** | Conectar admin: listar, crear, editar y eliminar productos. |
| **5** | Limpiar `localStorage`/`JSON` obsoletos y ejecutar smoke test front–backend. |

---

### Pendientes conocidos

- **Puente temporal `window.velas`:** la migración del módulo `src/js/velas.js` a `src/js/productos.js` deja `window.velas`, el evento `velas-listadas` y las exportaciones `velas` / `obtenerClaseCategoria` activos solo como puente para `catalogo.js`, `favoritos.js`, `carrito.js`, `productos-recomendados.js` y `carrusel.js`. Su reemplazo por importación directa del módulo de productos queda pendiente y debe corregirse antes de eliminar `velas.json`.

---

## 9. Checklist de aceptación (front–backend)

- [ ] Backend corriendo (H2 o MySQL) y front servido por Live Server.
- [ ] Catálogo carga desde `GET /api/productos`.
- [ ] Detalle por slug funciona y muestra "no encontrado" si no existe.
- [ ] Registro contra `POST /api/registro` crea cuenta y abre sesión.
- [ ] Login contra `POST /api/login` valida credenciales y abre sesión.
- [ ] Pedido desde el carrito llama `POST /api/pedidos` y descuenta stock.
- [ ] Mis pedidos carga desde `GET /api/pedidos?usuarioId=`.
- [ ] Admin crea un producto y se ve en la tienda.
- [ ] Admin edita y elimina un producto con confirmación y manejo de errores.
- [ ] Los estados de pedido muestran el label en español (`Pendiente`, `Confirmado`, etc.).
- [ ] Los errores de validación (`400`, `409`, `401`) se muestran en la interfaz.

---

> Este plan es una guía de implementación para el front. Si el backend cambia algún contrato (rutas, nombres de campos o respuestas), este documento debe actualizarse junto con el cambio de backend.