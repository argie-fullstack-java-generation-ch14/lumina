const BASE_URL = "https://lumina-backend-641dd.containers.snapdeploy.app";

async function request(url, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Recurso no encontrado.");
            }

            if (response.status === 401 || response.status === 403) {
                throw new Error("No tienes autorización para realizar esta acción.");
            }

            throw new Error(`Error HTTP: ${response.status}`);
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();

    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error("No se pudo conectar con el servidor.");
        }

        throw error;
    }
}

export const api = {
    get: (url) => request(url),

    post: (url, body) =>
        request(url, {
            method: "POST",
            body: JSON.stringify(body),
        }),

    put: (url, body) =>
        request(url, {
            method: "PUT",
            body: JSON.stringify(body),
        }),

    delete: (url) =>
        request(url, {
            method: "DELETE",
        }),
};