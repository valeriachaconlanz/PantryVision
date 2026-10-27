// Helper for calling our Spring Boot backend.
// When running locally, /api gets sent to localhost:8080 (see vite.config.js).

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`)
  }
  return response.status === 204 ? null : response.json()
}
