// Helper for calling our Spring Boot backend.
// When running locally, /api gets sent to localhost:8080 (see vite.config.js).

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export async function apiFetch(path, options = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    })
  } catch {
    throw new ApiError(0, "Can't reach the server. Is the backend running?")
  }
  if (!response.ok) {
    // our backend sends { message: "..." } when something goes wrong
    let message = `Something went wrong (${response.status})`
    try {
      const body = await response.json()
      if (body.message) message = body.message
    } catch {
      // not json, keep the default message
    }
    throw new ApiError(response.status, message)
  }
  return response.status === 204 ? null : response.json()
}
