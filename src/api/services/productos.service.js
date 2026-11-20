// Lumina · Servicio de Productos (mock backend)
// ------------------------------------------------------------
// Este archivo contiene la lógica de acceso a datos de productos.
// Tu equipo debe implementar aquí los métodos que consuman la API.
//
// Métodos sugeridos:
// - obtenerTodas(): GET todos los productos
// - obtenerPorSlug(slug): GET un producto por slug
// - obtenerPorCategoria(categoria): GET productos filtrados
// - crearProducto(data): POST nuevo producto (admin)
// - actualizarProducto(id, data): PUT actualizar producto (admin)
// - eliminarProducto(id): DELETE borrar producto (admin)
//
// Cada método debe retornar un objeto con la forma:
// { ok: boolean, data: any, error: string | null }
//
// Ejemplo de firma esperada:
// export const productosService = {
//   async obtenerTodas() { ... },
//   async obtenerPorSlug(slug) { ... },
// };
