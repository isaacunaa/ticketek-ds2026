import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import EventoDetalle from './pages/EventoDetalle'
import MisEntradas from './pages/MisEntradas'
import MisFavoritos from './pages/MisFavoritos'
import Terminos from './pages/legal/Terminos'
import Privacidad from './pages/legal/Privacidad'
import Reembolsos from './pages/legal/Reembolsos'

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

        {/* Protegidas — redirigen a /login si no hay token */}
        <Route
          path="/mis-entradas"
          element={
            <PrivateRoute>
              <MisEntradas />
            </PrivateRoute>
          }
        />
        <Route
          path="/mis-favoritos"
          element={
            <PrivateRoute>
              <MisFavoritos />
            </PrivateRoute>
          }
        />

        {/* Legal */}
        <Route path="/terminos"   element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/reembolsos" element={<Reembolsos />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Footer en todas las páginas */}
      <Footer />
    </BrowserRouter>
  )
}
