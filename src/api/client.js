// Lumina · API Client (mock backend)
// ------------------------------------------------------------
// Este archivo es el punto de entrada para consumir la API.
// Mientras el backend no esté listo, este archivo queda vacío
// o como esqueleto. Tu equipo debe implementar aquí:
//
// 1. La configuración del cliente HTTP (fetch o axios):
//    - baseURL del backend (ej. https://api.lumina.com)
//    - headers por defecto (Content-Type, Accept)
//    - interceptores de request (token de auth, etc.)
//
// 2. Funciones genéricas de petición:
//    - get(url, params?)
//    - post(url, body?)
//    - put(url, body?)
//    - delete(url?)
//
// 3. Manejo de errores centralizado:
//    - catch de errores de red
//    - mapeo de códigos de estado HTTP (401, 404, 500, etc.)
//
// 4. (Opcional) Simulación de red para desarrollo:
//    - delay artificial
//    - probabilidad de error simulado
//
// Ejemplo de firma esperada:
// export async function apiGet(url) { ... }
// export async function apiPost(url, body) { ... }
