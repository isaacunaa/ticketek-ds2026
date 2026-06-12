import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import vortice_icon from '../assets/vortice_favicon.svg'

export default function Header() {
  const navigate  = useNavigate()
  const token     = localStorage.getItem('token')
  const usuario   = JSON.parse(localStorage.getItem('usuario') || 'null')
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    closeMenu()
    navigate('/login')
  }

  return (
    <header className="header">
      <Link to="/" className="header-logo" onClick={closeMenu}>
        <img src={vortice_icon} alt="" className="header-logo-img" />
        <span className="header-logo-text">Vórtice</span>
      </Link>

      {/* Hamburger — solo visible en mobile */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Abrir menú"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Nav — en desktop siempre visible, en mobile togglable */}
      <nav className={`header-nav${menuOpen ? ' nav-open' : ''}`}>
        <Link to="/" className="header-nav-link" onClick={closeMenu}>Eventos</Link>

        {token && (
          <>
            <Link to="/mis-entradas"  className="header-nav-link" onClick={closeMenu}>Mis entradas</Link>
            <Link to="/mis-favoritos" className="header-nav-link" onClick={closeMenu}>Mis favoritos</Link>
          </>
        )}

        {token ? (
          <>
            <span className="header-user">
              Hola, {usuario?.nombre ?? 'Usuario'}
            </span>
            <button
              className="btn-pill btn-pill-outline"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    className="btn-pill btn-pill-outline" onClick={closeMenu}>
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn-pill btn-pill-solid" onClick={closeMenu}>
              Registrarse
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
