import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  return (
    <header className="header">
      <Link to="/" className="header-logo">Vórtice</Link>

      <nav className="header-nav">
        <Link to="/" className="header-nav-link">Eventos</Link>
        <Link to="/mis-entradas" className="header-nav-link">Mis entradas</Link>

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
            <Link to="/login" className="btn-pill btn-pill-outline">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn-pill btn-pill-solid">
              Registrarse
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
