export const endpoints = {
    productos: {
        all: "/api/productos",
        byId: (id) => `/api/productos/${id}`,
        bySlug: (slug) => `/api/productos/slug/${slug}`,
    },
};