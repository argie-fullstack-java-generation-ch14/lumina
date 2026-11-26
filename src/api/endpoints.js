// Lumina · API Endpoints
// ------------------------------------------------------------
// Rutas centralizadas de la API REST del backend.
// Base: http://localhost:8080/api/...

export const endpoints = {
  productos: {
    all: "/api/productos",
    byId: (id) => `/api/productos/${id}`,
    bySlug: (slug) => `/api/productos/slug/${slug}`,
    byCategory: (categoria) => `/api/productos?categoria=${encodeURIComponent(categoria)}`,
    available: "/api/productos?disponibles=true"
  },
  auth: {
    register: "/api/registro",
    login: "/api/login"
  },
  usuarios: {
    byId: (id) => `/api/usuarios/${id}`
  },
  pedidos: {
    all: "/api/pedidos",
    byUsuario: (usuarioId) => `/api/pedidos?usuarioId=${usuarioId}`,
    byId: (id) => `/api/pedidos/${id}`,
    updateStatus: (id) => `/api/pedidos/${id}/estado`
  }
};
