// Lumina · API Client
// ------------------------------------------------------------
// Cliente HTTP basado en fetch para consumir la API REST de Lumina.
// Backend: http://localhost:8080/api/...

const API_BASE_URL = window.LUMINA_API_URL || "http://localhost:8080";

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(data.message || "Error en la petición");
    error.status = response.status;
    error.error = data.error;
    error.details = data.details;
    error.timestamp = data.timestamp;
    throw error;
  }

  return data;
}

function getAuthHeaders(token) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiGet(path, token) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: getAuthHeaders(token)
  });
  return handleResponse(response);
}

export async function apiPost(path, body, token) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(body)
  });
  return handleResponse(response);
}

export async function apiPut(path, body, token) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(body)
  });
  return handleResponse(response);
}

export async function apiDelete(path, token) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: getAuthHeaders(token)
  });
  return handleResponse(response);
}

export { API_BASE_URL };
