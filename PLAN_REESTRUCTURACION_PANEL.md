# Plan de Reestructuración: Panel de Administración ("panel")

> **Estado:** Solo local. Este archivo **NO** se subirá a GitHub. Es un plan de trabajo para discutir antes de ejecutar.

---

## 1. Objetivo

Unificar las vistas del panel de administración bajo una sola página padre:

```
src/admin/panel/index.html   ← vista padre con tabs
```

donde la **primera pestaña sea "Productos"** (la vista de lista de productos actual), seguida de **Mi información**, **Mis pedidos** y **Favoritos**. Cada pestaña es un `<div class="tab-pane">` dentro del mismo HTML padre.

---

## 2. Estado actual

| Ruta | Qué es hoy |
|------|------------|
| `src/admin/panel/index.html` | Padre con 3 tabs (Información, Pedidos, Favoritos). Carga contenidos vía `fetch()` + `innerHTML` desde `mi-cuenta.js`. |
| `src/admin/panel/productos/index.html` | Vista lista de productos como HTML completo (`<html>`, `<head>`, scripts propios). Vista independiente. |
| `src/admin/panel/info/index.html` | Fragmento (solo `<div>`), cargado vía `fetch`. |
| `src/admin/panel/pedidos/index.html` | Fragmento (solo `<div>`), cargado vía `fetch`. |
| `src/admin/panel/favoritos/index.html` | Fragmento (solo `<div>`), cargado vía `fetch`. |
| `src/admin/panel/mi-cuenta.js` | Orquesta los 3 `fetch()` hacia info/pedidos/favoritos e inyecta scripts. |

---

## 3. Propuesta de reestructuración

### 3.1 Vista padre: `src/admin/panel/index.html`

Se convierte en la **única entrada** del panel. Contiene:

- `<header id="header"></header>` y `<footer id="footer"></footer>` (una sola vez).
- **Nav pills verticales** (sidebar izquierda, `col-md-4`) con 4 tabs en este orden:
  1. **Productos** ← NUEVO, primero y activo por defecto
  2. Mi Información
  3. Mis pedidos
  4. Favoritos
- `<div class="tab-content">` (derecha, `col-md-8`) con 4 `tab-pane`:
  - `#panel-productos` → contenido de lista de productos
  - `#panel-info` → información de cuenta
  - `#panel-pedidos` → pedidos
  - `#panel-favoritos` → favoritos
- `<div id="productFormModalMount"></div>` para el modal de crear/editar producto.

### 3.2 Pestaña Productos (nueva, primera)

El contenido actual de `src/admin/panel/productos/index.html` se traslada como HTML embebido dentro de `div.tab-pane#panel-productos`. Se eliminan las etiquetas `<html>`, `<head>`, `<body>` duplicadas y los enlaces/scripts ya declarados en el padre.

### 3.3 Pestañas existentes (ya son fragmentos)

- **Mi información:** `src/admin/panel/info/index.html` → `div.tab-pane#panel-info`
- **Mis pedidos:** `src/admin/panel/pedidos/index.html` → `div.tab-pane#panel-pedidos`
- **Favoritos:** `src/admin/panel/favoritos/index.html` → `div.tab-pane#panel-favoritos`

Estos ya son fragmentos, solo requieren ajustes menores de IDs para no colisionar con el padre.

### 3.4 Cambios en `mi-cuenta.js`

Actualmente hace 3 `fetch()` para cargar info/pedidos/favoritos por separado. Con las `tab-pane` ya embebidas en el padre, **ya no es necesario hacer fetch de esos HTML**. El JS de cada módulo se carga desde el padre y se inicializa cuando su tab se activa (evento `shown.bs.tab`).

### 3.5 Orden de pestañas (de izquierda a derecha / arriba a abajo)

1. **Productos** (nuevo, primero, activo por defecto)
2. Mi Información
3. Mis pedidos
4. Favoritos

---

## 4. Archivos afectados

| Archivo | Acción |
|---------|--------|
| `src/admin/panel/index.html` | Reestructuración principal: tabs + tab-panes embebidos |
| `src/admin/panel/productos/index.html` | Convertir a fragmento `tab-pane` (quitar `<html>`/`<head>`/`<body>`) |
| `src/admin/panel/info/index.html` | Ajustar IDs si colisionan (ya es fragmento) |
| `src/admin/panel/pedidos/index.html` | Ajustar IDs si colisionan (ya es fragmento) |
| `src/admin/panel/favoritos/index.html` | Ajustar IDs si colisionan (ya es fragmento) |
| `src/admin/panel/mi-cuenta.js` | Simplificar: quitar `fetch()` de HTMLs, mantener inicialización por tab |

---

## 5. Consideraciones técnicas

- **Autenticación:** El padre (`index.html`) debe protegerse con `<script type="module">import { requireAuth } from "../../api/authGuard.js"; requireAuth(["ADMIN", "STAFF"]);</script>`.
- **Evitar duplicidad:** `header`, `footer`, Bootstrap y scripts principales (`ui.js`, `main.js`) solo se declaran una vez en el padre.
- **Carga de scripts por tab:** Los scripts específicos de productos (`productos.js`, `producto-formulario.js`) y de cada módulo se cargan desde el padre e inicializan al activar su tab (`shown.bs.tab`).
- **IDs únicos:** Revisar que no haya IDs duplicados entre el padre y los fragmentos (ej. `product-list`, `favoritos-items-container`, etc.).

---

## 6. No incluido en este plan

- No subir este archivo a GitHub (solo plan local).
- No modificar `src/tienda/mi-cuenta/` (la tienda sigue independiente).
- No cambiar endpoints del backend; el panel sigue consumiendo `GET /api/productos`, etc.

---

## 7. Próximos pasos (cuando se apruebe el plan)

1. Reescribir `src/admin/panel/index.html` con los 4 tabs y los 4 `tab-pane`.
2. Mover el contenido de lista de productos a `#panel-productos`.
3. Simplificar `src/admin/panel/mi-cuenta.js`.
4. Probar que cada tab cargue y funcione (listar productos, ver info, ver pedidos, ver favoritos).
5. Probar crear/editar/eliminar producto desde la pestaña Productos.
