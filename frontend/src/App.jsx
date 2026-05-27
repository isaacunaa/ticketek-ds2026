import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import EventoDetalle from './pages/EventoDetalle'
import MisEntradas from './pages/MisEntradas'

export default function App() {
  return (
    <BrowserRouter>
      {/* Header fijo en todas las páginas */}
      <Header />

      {/* Contenido principal */}
      <Routes>
        {/* Públicas */}
        <Route path="/"            element={<Home />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/eventos/:id" element={<EventoDetalle />} />

        {/* Protegida — redirige a /login si no hay token */}
        <Route
          path="/mis-entradas"
          element={
            <PrivateRoute>
              <MisEntradas />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Footer en todas las páginas */}
      <Footer />
    </BrowserRouter>
  )
}
