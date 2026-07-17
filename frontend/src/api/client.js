import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Agrega Authorization: Bearer <token> automáticamente
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 401 → limpia sesión y redirige a /login
// (excepto en /auth/login: ahí el 401 es "contraseña incorrecta", no una sesión expirada,
// y el propio formulario ya se encarga de mostrar el error sin recargar la página)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const esLoginRequest = error.config?.url?.includes('/auth/login')
    if (error.response?.status === 401 && !esLoginRequest) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
