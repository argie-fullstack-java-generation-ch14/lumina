# Ajustes previos en el front para integrar con el backend

Lista de cambios que debe aplicar el frontend (repo `lumina/`) antes y durante la integración con el backend. Cada ítem es accionable y se puede tildar al completarse.

## 1. Capa de API (prioridad alta)

- [ ] Crear `src/api/client.js` con `fetch` base (`baseURL`, headers `Content-Type: application/json`, manejo de errores `ApiError`).
- [ ] Crear `src/api/endpoints.js` con las rutas del backend (sin modificar rutas):
  - `GET /api/productos` (opcional `?categoria=` y `disponibles=true`)
  - `GET /api/productos/{id}`
  - `GET /api/productos/slug/{slug}`
  - `POST /api/productos`
  - `PUT /api/productos/{id}`
  - `DELETE /api/productos/{id}`
  - `POST /api/registro` `{ fullName, phone, email, password }`
  - `POST /api/login` `{ email, password }`
  - `GET /api/usuarios/{id}`
  - `PUT /api/usuarios/{id}` `{ fullName, phone }`
  - `POST /api/pedidos` `{ userId, items: [{ productId, quantity }], couponCode? }`
  - `GET /api/pedidos?usuarioId=`
  - `GET /api/pedidos/{id}`
  - `PUT /api/pedidos/{id}/estado` `{ status }`
- [ ] Crear `src/api/services/*.js` que llamen a los endpoints y devuelvan datos ya mapeados.
- [ ] Crear `src/api/adapters.js` para mapear respuestas del backend a la forma que espera el front (ver sección 4).

## 2. Catálogo, home, detalle y componentes que consumen velas

- [ ] Renombrar/convertir `src/js/velas.js` a `src/js/productos.js` (o tratarlo como capa genérica de productos) para coherencia con el dominio del backend.
- [ ] Reemplazar el `fetch` a `src/data/velas.json` por `GET /api/productos`.
- [ ] Mantener `window.velas`, el evento `velas-listadas` y las exportaciones `velas` y `obtenerClaseCategoria` **solo como puente temporal** para no romper `catalogo.js`, `favoritos.js`, `carrito.js`, `productos-recomendados.js` y `carrusel.js`.
- [ ] `src/tienda/catalogo/catalogo.js`: cargar todos los productos una vez y seguir filtrando/ordenando en el front (o usar `?categoria=` y `disponibles=true` del backend como optimización posterior).
- [ ] `src/tienda/catalogo/producto/producto.js`: buscar por `slug` en el módulo de productos; si no existe, mostrar estado "no encontrado" en lugar de caer al primer producto.
- [ ] Dejar de usar `velas.json` en runtime; mantener solo como referencia hasta verificar la integración, luego eliminar.

## 3. Autenticación

- [ ] `src/tienda/registro/registro.js`: llamar `POST /api/registro` con `{ fullName, phone, email, password }`; al éxito, guardar `UserResponse` mapeado en `usuarioActivo`; eliminar escritura en `usuarios` y no almacenar contraseña.
- [ ] `src/tienda/login/login.js`: llamar `POST /api/login` con `{ email, password }`; no validar contraseña localmente; usar el resultado del backend; eliminar lectura del array `usuarios`.
- [ ] `src/js/main.js` (header): leer `usuarioActivo` ya mapeado (`nombreCompleto`).
- [ ] `src/tienda/mi-cuenta/info/index.html` + `info.js`: eliminar el bloque de contraseña (el backend no la devuelve); mostrar nombre, correo y teléfono. Edición futura con `PUT /api/usuarios/{id}` `{ fullName, phone }`.

## 4. Mapeo de campos (adapter)

- [ ] `imageUrl` (backend) → `img` (front).
- [ ] `weightGrams` (backend) → `weight` (front).
- [ ] `category` (backend) → normalizar mayúsculas/minúsculas para clases CSS del front.
- [ ] `OrderResponse.items` no trae `img`, `scent`, `weight`, `color`: resolver cada `item.productId` contra el catálogo de productos para obtener esos datos; fallback si no se encuentra.
- [ ] Estados de pedido (`PENDING`, `CONFIRMED`, `PREPARING`, `COMPLETED`, `CANCELLED`) → mapear a etiquetas de UI.

## 5. Carrito, checkout y mis pedidos

- [ ] Checkout (`src/componentes/checkout-modal/checkout-modal.js`): validar que exista sesión (`usuarioActivo.id`); si no hay sesión, redirigir al login o mostrar mensaje.
- [ ] En lugar de generar `L-####` y guardar en `localStorage`, llamar `POST /api/pedidos` con `{ userId, items: [{ productId, quantity }] }` (y `couponCode` si aplica).
- [ ] Construir el pedido para mostrar al usuario usando `OrderResponse`:
  - `numeroOrden` = `orderNumber` del backend (formato `LUM-000001`).
  - `fecha` = formatear `createdAt`.
  - `estado` = valor backend + label del mapa de estados.
  - `productos` = resolver cada `item.productId` contra `velas` para obtener `name`, `img`, `scent`, `weight`, `color`; fallback si no se encuentra.
  - `totales` = `subtotal`, `discountTotal`, `taxTotal`, `total` del backend.
- [ ] `src/tienda/mi-cuenta/pedidos/pedidos.js`: dejar de mezclar `pedidos.json` con `lumina-pedidos`; llamar `GET /api/pedidos?usuarioId=` y renderizar usando el mapa de estados y el resumen del backend.

## 6. IVA y cupones (cuando el backend esté listo)

- [ ] Dejar de calcular IVA y descuentos localmente en `src/js/carrito.js` y usar los valores de `OrderResponse` (`subtotal`, `discountTotal`, `taxTotal`, `total`).
- [ ] Enviar `couponCode` dentro del cuerpo de `POST /api/pedidos`.
- [ ] Quitar la nota temporal de la sección de IVA/cupones en el plan de integración.

## 7. Limpieza de almacenamiento local

- [ ] Limpiar `localStorage` y JSON obsoletos (`usuarios`, `usuarioActivo`, `lumina-productos`, `lumina-pedidos`, `lumina-carrito`, `lumina-favoritos`).
- [ ] Admin y tienda deben leer de la misma API (`GET /api/productos`), no de `lumina-productos` mezclado en `src/js/velas.js`.

## 8. Admin (CRUD de productos)

- [ ] Listar productos con `GET /api/productos`.
- [ ] Crear con `POST /api/productos`: agregar al formulario los campos `stock` (requerido) y `available` (checkbox, por defecto `true`). Usar el `value` del `<select>` de categoría (ya es el texto del backend) y no el `textContent`.
- [ ] Editar: añadir botón por producto, abrir el modal precargado y llamar `PUT /api/productos/{id}`.
- [ ] Eliminar: `DELETE /api/productos/{id}` con confirmación y manejo de `409` (producto con dependencias).
- [ ] Mapear `ApiError.details` a los campos del formulario.
- [ ] Eliminar la lógica de `lumina-productos` y su mezcla en `src/js/velas.js`; el admin y la tienda leen de la misma API.

## 9. Pendientes conocidos (puente temporal)

- [ ] Reemplazar la dependencia de `window.velas`, el evento `velas-listadas` y las exportaciones `velas` / `obtenerClaseCategoria` por importación directa del módulo de productos antes de eliminar `velas.json`.

## 10. Checklist de aceptación (front–backend)

- [ ] Backend corriendo y front servido por Live Server.
- [ ] Catálogo carga desde `GET /api/productos`.
- [ ] Detalle por slug funciona y muestra "no encontrado" si no existe.
- [ ] Registro contra `POST /api/registro` crea cuenta y abre sesión.
- [ ] Login contra `POST /api/login` valida credenciales y abre sesión.
- [ ] Pedido desde el carrito llama `POST /api/pedidos` y descuenta stock.
- [ ] Mis pedidos carga desde `GET /api/pedidos?usuarioId=`.
- [ ] Admin crea un producto y se ve en la tienda.
