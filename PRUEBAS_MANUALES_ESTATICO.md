# Pruebas manuales - Ajustes estáticos del front

Lista de pruebas para validar que los cambios de nomenclatura y modelo de datos estáticos están correctos **sin llamar al backend** (solo `productos.json`, `pedidos.json` y `localStorage`).

Cómo usar: servir con `npx serve` en `http://localhost:3000`, recorrer los ítems y tildar al pasar.

## 0. Antes de comenzar

- [ ] Servir `lumina/` con Live Server en `http://localhost:5500` (puerto que ya usa el back para CORS).
- [ ] Abrir la consola del navegador (F12) y revisar que no haya errores de carga de módulos ni `404` en `productos.js` / `productos.json`.
- [ ] Limpiar `localStorage` (`localStorage.clear()` en consola) para probar desde cero.

---

## 1. Catálogo y home

### 1.1 Carga del catálogo
- [x] Abrir `tienda/catalogo/index.html`: la lista de productos se muestra completa (22 productos).
- [x] Abrir `index.html` (home): el carrusel del catálogo se muestra con productos.
- [x] En consola no aparece `window.velas is undefined` ni error de `fetch` a `velas.json`.

### 1.2 Campos del producto en tarjetas
- [x] Cada tarjeta muestra: `name`, `imageUrl` (imagen carga), `scent`, `category`, `weightGrams g`, `color`, `description`, `price`.
- [x] Al pasar el mouse o inspeccionar el DOM, las imágenes usan `src` con `imageUrl` (no `img`).

### 1.3 Filtros y orden
- [x] Filtrar por categoría funciona (ej. seleccionar "Navidad" muestra solo productos de Navidad). (HTML: checkboxes `name="category"` presentes)
- [ ] Filtrar por aroma (`scent`) funciona. (NO implementado: no hay checkboxes `name="scent"` en el HTML)
- [ ] Ordenar por nombre ascendente/descendente y por precio ascendente/descendente funciona. (NO implementado: no hay `<select id="sort-products">` en el HTML)
- [ ] El contador muestra la cantidad correcta de productos visibles. (NO implementado: no hay `<span id="products-count">` en el HTML)

Nota: `catalogo.js` tiene el código JS para scent, orden y contador, pero el HTML no incluye esos elementos de UI, por lo que no funcionan en la práctica.

### 1.4 Favoritas de temporada
- [x] Abrir `tienda/catalogo/favoritos-de-temporada/favoritos-de-temporada.html`: muestra carrusel con productos de Navidad y Halloween.

---

## 2. Detalle de producto

### 2.1 Página de detalle por slug
- [x] Abrir `tienda/catalogo/producto/index.html?slug=renacer` (y cualquier slug): muestra `name`, `imageUrl`, `scent`, `weightGrams g`, `color`, `description`, `price`.
- [x] Abrir con un slug inexistente: no cae al primer producto silenciosamente (maneja "no encontrado" si corresponde; si no, al menos no rompe).
- [x] El botón "Agregar al carrito" tiene `data-product-id` correcto.

---

## 3. Carrito

### 3.1 Agregar y gestionar items
- [x] Desde el catálogo, agregar un producto al carrito: se muestra la notificación toast con `imageUrl` y `name`.
- [x] Abrir `tienda/carrito/index.html`: el carrito muestra los items agregados con `imageUrl`, `name`, `scent`, `weightGrams g`, `color`, `price`.
- [x] Aumentar/disminuir cantidad funciona; al llegar a 0 el producto sale del carrito.
- [x] Eliminar un item funciona.

### 3.2 Totales y cupón
- [x] El resumen muestra `Subtotal`, `descuento` (si hay cupón), `IVA`, `Total` con los nombres de clave nuevos (`discountTotal`, `taxTotal`, `total`).
- [x] Aplicar cupón `LUMINA26`: el descuento se aplica (10 % sobre subtotal) y se recalculan `IVA` y `Total`.
- [x] Aplicar cupón inválido: muestra mensaje "El cupón ingresado no es válido." y no aplica descuento.
- [x] Vaciar carrito: limpia items y cupón.

### 3.3 Persistencia
- [x] Recargar la página del carrito: los items persisten (vienen de `localStorage` con clave `lumina-carrito` y forma `{productId, quantity}`).

---

## 4. Favoritos

### 4.1 Agregar y gestionar favoritos
- [x] Desde el catálogo o detalle, agregar un producto a favoritos: el corazón cambia a estado activo y aparece la notificación toast.
- [x] Abrir `tienda/favoritos/index.html`: muestra los productos favoritos con `imageUrl`, `name`, `weightGrams g`.
- [x] Quitar un producto de favoritos funciona.
- [x] Vaciar favoritos funciona.

### 4.2 Persistencia
- [x] Recargar la página de favoritos: persiste la lista (clave `lumina-favoritos`).

---

## 5. Autenticación (registro y login, sin backend)

### 5.1 Registro
- [x] Abrir `tienda/registro/registro.js` / `index.html`: completar nombre, teléfono, correo y contraseña.
- [x] Al enviar: se guarda en `localStorage` clave `usuarios` con objeto `{ fullName, phone, email, password }`.
- [x] No se guarda `nombreCompleto` ni `contrasena` como nombres de clave (verificar en consola: `localStorage.getItem('usuarios')`).

### 5.2 Login
- [x] Abrir `tienda/login/index.html`: iniciar sesión con credenciales registradas.
- [x] Al entrar sesión: `usuarioActivo` en `localStorage` tiene forma `{ fullName, phone, email }` **sin contraseña**.
- [x] Credenciales incorrectas: muestra "Correo o contraseña incorrectos." y no abre sesión.

### 5.3 Header con sesión
- [x] Con sesión activa, el header muestra el nombre (`fullName`) y el botón "Cerrar sesión".
- [x] Cerrar sesión: elimina `usuarioActivo` y vuelve al estado sin sesión.

---

## 6. Mi cuenta - Información

### 6.1 Página de información
- [x] Abrir `tienda/mi-cuenta/info/index.html` con sesión: muestra `Nombre completo` (`fullName`), `Correo electrónico` (`email`), `Número de teléfono` (`phone`).
- [x] **No** se muestra el campo de contraseña (se eliminó la lectura de `contrasena`).

---

## 7. Mi cuenta - Pedidos

### 7.1 Carga de pedidos
- [x] Abrir `tienda/mi-cuenta/pedidos/pedidos.js` / `index.html`: los pedidos de `pedidos.json` se muestran con forma `OrderResponse` (`orderNumber`, `createdAt`, `status`, `open`, totales, `items`).
- [x] Cada pedido muestra: número de orden, fecha formateada, total, estado con badge.
- [x] Cada producto dentro del pedido se resuelve contra `window.productos` para mostrar `imageUrl`, `scent`, `weightGrams g`, `color`.

### 7.2 Estados
- [x] Los estados usan valores del backend (`PENDING`, `COMPLETED`, etc.) con su label correspondiente.

### 7.3 Pedidos guardados localmente
- [x] Realizar un checkout (ver sección 8) y verificar que el pedido aparezca en "Mis pedidos" con la nueva forma.

---

## 8. Checkout

### 8.1 Crear pedido
- [x] Tener sesión iniciada y productos en el carrito.
- [x] Abrir el modal de checkout y finalizar compra.
- [x] El pedido se guarda en `lumina-pedidos` con forma `OrderResponse`: `orderNumber`, `createdAt` (ISO), `status: "PENDING"`, `open: true`, `subtotal`, `discountTotal`, `taxTotal`, `total`, `items[{productId, productName, unitPrice, quantity, lineTotal}]`.
- [x] El carrito se vacía después de crear el pedido.

### 8.2 Sin sesión
- [x] Sin sesión iniciada, intentar finalizar compra: debe redirigir al login o mostrar mensaje (según implementación actual).

---

## 9. Admin - CRUD de productos

### 9.1 Crear producto
- [x] Abrir `admin/productos/index.html`, abrir el modal y crear un producto.
- [x] El objeto guardado en `lumina-productos` usa claves `imageUrl`, `weightGrams`, `stock`, `available`, `category` (y no `img` ni `weight`).
- [x] El producto creado se muestra en la lista del admin y en el catálogo (tras fusionar `lumina-productos`).

---

## 10. Módulos de API (placeholders)

### 10.1 Archivos de API
- [x] `src/api/endpoints.js` referencia `/api/productos` (no `/api/velas`).
- [x] `src/api/services/velas.service.js` pasó a ser servicio de productos (`productosService`).
- [x] Estos archivos siguen siendo placeholders (sin llamadas reales al back en esta fase).

---

## 11. Verificación de nombres residuales

En consola y buscando en el código, confirmar que **no quedan**:

- [x] `window.velas` / `velas-listadas`
- [x] `img` (como propiedad de producto; las clases CSS `candle-img` pueden quedarse)
- [x] `.weight` (como propiedad; las clases CSS `candle-weight` / `product-weight` pueden quedarse)
- [x] `nombreCompleto` / `contrasena` (como claves de objeto de usuario)
- [x] `numeroOrden` / `fecha` / `estado` / `productos` / `totales` (como claves de pedido)
- [x] `<script src="...velas.js">` en HTML

---

## 12. Criterio de aceptación global

- [x] El front funciona igual que antes con datos estáticos (`productos.json`, `pedidos.json`, `localStorage`).
- [x] Todos los objetos en memoria tienen la forma de `Product`, `OrderResponse` y `UserResponse` del backend.
- [x] Al cambiar el origen de datos a `fetch` (fase posterior), solo hace falta reemplazar la carga de JSON por llamadas a `/api/productos`, `/api/pedidos`, etc., sin tocar la lógica de UI.
