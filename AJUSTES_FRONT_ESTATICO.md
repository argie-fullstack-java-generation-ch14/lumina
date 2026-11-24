# Ajustes estáticos del front (sin llamar al backend)

Alinea nombres de archivos, propiedades de objetos y estructuras de datos estáticas (`velas.json`→`productos.json`, `pedidos.json`, `localStorage`) con el modelo del backend, **sin hacer `fetch` a la API todavía**. Las claves de `localStorage` se mantienen; solo cambian las propiedades de los objetos guardados.

## 1. Producto (antes "vela")

- Renombrar `src/js/velas.js` → `src/js/productos.js`.
- Renombrar `src/data/velas.json` → `src/data/productos.json`.
- Renombrar símbolos: `velas` → `productos`, `window.velas` → `window.productos`, evento `velas-listadas` → `productos-listados`, bucle `vela` → `producto`.
- Renombrar propiedades del objeto producto (en JSON y en todo el JS que las consume):
  - `img` → `imageUrl`
  - `weight` → `weightGrams`
- Mantener: `id`, `name`, `slug`, `scent`, `category`, `color`, `description`, `price`.
- Agregar al JSON estático: `stock` y `available` (por ejemplo `available: true`) para igualar el modelo `Product` del backend.
- Renombrar función `obtenerClaseCategoria` → `obtenerClaseCategoriaProducto` (opcional pero recomendado).
- Actualizar consumidores: `catalogo.js`, `catalogo/producto/producto.js`, `catalogo/favoritos-de-temporada/favoritos-de-temporada.js`, `carrito.js`, `favoritos.js`, `productos-recomendados.js`, `carrusel.js`, `carrito/item-carrito/item-carrito.js`, `favoritos/item-favoritos/item-favoritos.js`, `item-mis-pedidos/item-mis-pedidos.js`, `admin/productos/productos.js`, `admin/producto-formulario/producto-formulario.js`, `checkout-modal/checkout-modal.js`, `main.js`.

## 2. Categoría: label (pantalla) y value (máquina)

Normalizar cada categoría en dos partes:

- `category` (label de pantalla): `Amor propio`, `Bienestar`, `Descanso`, `Halloween`, `Intención`, `Mindfulness`, `Navidad`, `Rituales`.
- `categoryValue` (valor máquina, minúsculas y sin tilde): `amor-propio`, `bienestar`, `descanso`, `halloween`, `intencion`, `mindfulness`, `navidad`, `rituales`.

Ejemplo en `productos.json`:
```json
{
  "id": 3,
  "name": "Equilibrio",
  "slug": "equilibrio",
  "imageUrl": "...",
  "scent": "Lavanda - Manzanilla",
  "category": "Mindfulness",
  "categoryValue": "mindfulness",
  "weightGrams": 200,
  "color": "Verde menta pastel",
  "description": "...",
  "price": 12000,
  "stock": 100,
  "available": true
}
```

- `obtenerClaseCategoriaProducto(category)` sigue usando el label para la clase CSS (`category-mindfulness`, etc.).
- Para filtros/temporadas (`favoritos-de-temporada.js`) usar `categoryValue` en lugar de comparar el label directamente.

## 3. Carrito

- Cambiar el item del carrito de `{ id, quantity }` → `{ productId, quantity }` (igual que `OrderItemRequest` del backend).
- Actualizar `carrito.js`: carga/guardado, `find`, cambiar cantidad, eliminar, render y `obtenerProductosCarrito`.
- Actualizar cualquier componente que lea `item.id` para usar `productId`.
- Clave `lumina-carrito` se mantiene.

## 4. Pedido (forma de `OrderResponse`)

Cambiar `pedidos.json` y los pedidos guardados en `localStorage` a la estructura de respuesta del backend:

- `numeroOrden` → `orderNumber`
- `fecha` → `createdAt` (guardar cadena ISO y formatear en la UI)
- `estado` → `status` con valores del backend: `PENDING`, `CONFIRMED`, `PREPARING`, `COMPLETED`, `CANCELLED`
- `abierto` → `open` (estado de UI)
- `productos` → `items`; cada ítem pasa de objeto producto completo a:
  `{ productId, productName, unitPrice, quantity, lineTotal }`
- `totales` → campos planos del pedido: `subtotal`, `discountTotal`, `taxTotal`, `total`

Ejemplo de pedido en forma backend:
```json
{
  "orderNumber": "L-1236",
  "createdAt": "2026-11-13T10:00:00",
  "status": "PENDING",
  "open": true,
  "subtotal": 24000,
  "discountTotal": 0,
  "taxTotal": 4560,
  "total": 28560,
  "items": [
    { "productId": 11, "productName": "Noche de Paz", "unitPrice": 12000, "quantity": 2, "lineTotal": 24000 }
  ]
}
```

- `checkout-modal.js`: al crear el pedido local, usar esta forma (el número puede seguir siendo temporal `L-####`).
- `pedidos.js` e `item-mis-pedidos.js`: leer la nueva forma; para mostrar `imageUrl`, `scent`, `weightGrams`, `color`, resolver cada `item.productId` contra `window.productos`.
- Crear mapa central de estados backend → etiquetas:
  - `PENDING` → Pendiente
  - `CONFIRMED` → Confirmado
  - `PREPARING` → En preparación
  - `COMPLETED` → Completado
  - `CANCELLED` → Cancelado

## 5. Usuario (forma de `UserResponse`)

Alinear el objeto de sesión a `UserResponse`: `{ id, fullName, phone, email, role, createdAt }`.

- `nombreCompleto` → `fullName`
- `telefono` → `phone`
- Mantener `email` y agregar `id`, `role`, `createdAt`.
- `registro.js`: guardar en `usuarios` con `fullName`, `phone`, `email`, `password` (la contraseña solo para validación local).
- `login.js`: comparar `item.password` y guardar en `usuarioActivo` solo el `UserResponse` mapeado, **sin** `contrasena`.
- `main.js`: usar `user.fullName`.
- `info.js` + `info/index.html`: usar `fullName` y `phone`; quitar el bloque de contraseña (el backend no la devuelve).
- Claves `usuarios` y `usuarioActivo` se mantienen.

## 6. Totales

- En `carrito.js` y `resumen-compra.js`: `descuento` → `discountTotal`, `iva` → `taxTotal`; mantener `subtotal` y `total`.
- En `pedidos.js`, `calcularTotalesPedido` debe devolver las mismas claves (`subtotal`, `discountTotal`, `taxTotal`, `total`).

## 7. Consumidores a revisar (checklist)

- `src/js/productos.js`, `carrito.js`, `favoritos.js`, `main.js`
- `src/tienda/catalogo/catalogo.js`, `catalogo/producto/producto.js`, `catalogo/favoritos-de-temporada/favoritos-de-temporada.js`
- `src/componentes/carrusel/carrusel.js`, `productos-recomendados/productos-recomendados.js`, `carrito/item-carrito/item-carrito.js`, `favoritos/item-favoritos/item-favoritos.js`, `item-mis-pedidos/item-mis-pedidos.js`, `checkout-modal/checkout-modal.js`, `componentes-carrito/resumen-compra.js`
- `src/tienda/mi-cuenta/pedidos/pedidos.js`, `mi-cuenta/info/info.js`
- `src/tienda/registro/registro.js`, `tienda/login/login.js`
- `src/admin/productos/productos.js`, `admin/producto-formulario/producto-formulario.js`

## 8. Criterio de aceptación (sin API)

- No quedan referencias a `window.velas`, `velas-listadas`, `img`, `weight`, `nombreCompleto`, `contrasena`, `numeroOrden`, `fecha`, `estado`, `productos` (en pedidos) ni `totales`.
- El front sigue funcionando igual con `productos.json`, `pedidos.json` y `localStorage`.
- Los objetos en memoria tienen la forma de `Product`, `OrderResponse` y `UserResponse`, listos para cambiar solo el origen de datos a `fetch`.

## 9. Decisiones tomadas

- Archivo separado (no reemplaza `AJUSTES_FRONT_PREVIO_INTEGRACION.md`).
- Claves de `localStorage` se mantienen; solo cambian las propiedades de los objetos.
- Categorías con label de pantalla y valor máquina normalizado (ej. `Intención` / `intencion`).
