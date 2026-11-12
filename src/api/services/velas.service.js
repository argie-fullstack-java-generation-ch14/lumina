// Lumina · Servicio de Velas (mock backend)
// ------------------------------------------------------------
// Este archivo contiene la lógica de acceso a datos de velas.
// Tu equipo debe implementar aquí los métodos que consuman la API.
//
// Métodos sugeridos:
// - obtenerTodas(): GET todas las velas
// - obtenerPorSlug(slug): GET una vela por slug
// - obtenerPorCategoria(categoria): GET velas filtradas
// - crearVela(data): POST nueva vela (admin)
// - actualizarVela(id, data): PUT actualizar vela (admin)
// - eliminarVela(id): DELETE borrar vela (admin)
//
// Cada método debe retornar un objeto con la forma:
// { ok: boolean, data: any, error: string | null }
//
// Ejemplo de firma esperada:
// export const velasService = {
//   async obtenerTodas() { ... },
//   async obtenerPorSlug(slug) { ... },
// };
