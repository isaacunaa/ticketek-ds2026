import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import client from '../api/client'
import { getImagenEvento, normalizarCategorias } from '../utils/eventos'

export default function EventoDetalle() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const token    = localStorage.getItem('token')

  const [evento,   setEvento]   = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  const [comprando,   setComprando]   = useState(false)
  const [compraOk,    setCompraOk]    = useState(false)
  const [compraError, setCompraError] = useState('')

  const [esFavorito,   setEsFavorito]   = useState(false)
  const [togglingFav,  setTogglingFav]  = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await client.get(`/eventos/${id}`)
        setEvento(data.evento ?? data)
      } catch (err) {
        setError(
          err.response?.status === 404
            ? 'El evento no existe.'
            : 'No se pudo cargar el evento.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  useEffect(() => {
    if (!token) return
    client.get('/favoritos')
      .then(({ data }) => {
        const ids = (data.favoritos ?? []).map((f) => f.evento_id)
        setEsFavorito(ids.includes(Number(id)))
      })
      .catch(() => {})
  }, [id, token])

  const handleToggleFavorito = async () => {
    if (!token) { navigate('/login'); return }
    setTogglingFav(true)
    try {
      if (esFavorito) {
        await client.delete(`/favoritos/${id}`)
        setEsFavorito(false)
      } else {
        await client.post(`/favoritos/${id}`)
        setEsFavorito(true)
      }
    } catch {
      // silencioso — el estado no cambia
    } finally {
      setTogglingFav(false)
    }
  }

  const handleComprar = async () => {
    if (!token) { navigate('/login'); return }

    setComprando(true)
    setCompraError('')
    try {
      await client.post('/entradas', { evento_id: Number(id) })
      setCompraOk(true)
    } catch (err) {
      setCompraError(
        err.response?.data?.error   ||
        err.response?.data?.message ||
        'No se pudo completar la compra.'
      )
    } finally {
      setComprando(false)
    }
  }

  /* ── Estados de carga ───────────────────────────────────── */
  if (loading) return (
    <div className="detalle-page">
      <div className="state-box"><span className="spinner" /><p>Cargando evento...</p></div>
    </div>
  )

  if (error) return (
    <div className="detalle-page">
      <div className="state-box" style={{ color: 'var(--danger)' }}>
        <p>⚠️ {error}</p>
        <Link to="/" className="btn-retry">← Volver al catálogo</Link>
      </div>
    </div>
  )

  /* ── Datos del evento ───────────────────────────────────── */
  const nombre     = evento.titulo || 'Sin nombre'
  const imagenUrl  = getImagenEvento(evento)
  const categorias = normalizarCategorias(evento.categoria)

  const fechaFmt = evento.fecha_hora
    ? new Date(evento.fecha_hora).toLocaleDateString('es-AR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  const horaFmt = evento.fecha_hora
    ? new Date(evento.fecha_hora).toLocaleTimeString('es-AR', {
        hour: '2-digit', minute: '2-digit',
      })
    : null

  const precioLabel =
    evento.precio == null ? null :
    evento.precio === 0   ? 'Gratis' :
    `$${Number(evento.precio).toLocaleString('es-AR')}`

  return (
    <div className="detalle-page">
      <div className="detalle-inner">
        <Link to="/" className="back-link">← Volver al catálogo</Link>

        <div className="detalle-grid">
          {/* ── Columna principal ─────────────────────────── */}
          <div className="detalle-main">
            <img src={imagenUrl} alt={nombre} className="detalle-img" />

            <div className="detalle-content">
              {categorias.length > 0 && (
                <div className="event-badges" style={{ marginBottom: '.85rem' }}>
                  {categorias.map((cat) => (
                    <span key={cat} className="detalle-badge">{cat}</span>
                  ))}
                </div>
              )}

              <h1 className="detalle-title">{nombre}</h1>

              <div className="detalle-meta">
                {fechaFmt && (
                  <div className="detalle-meta-item">
                    <span>📅</span>
                    <span>{fechaFmt}{horaFmt ? ` · ${horaFmt} hs` : ''}</span>
                  </div>
                )}
                {evento.ubicacion && (
                  <div className="detalle-meta-item">
                    <span>📍</span>
                    <span>{evento.ubicacion}</span>
                  </div>
                )}
                {precioLabel && (
                  <div className="detalle-meta-item">
                    <span>💰</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent-dark)' }}>
                      {precioLabel}
                    </span>
                  </div>
                )}
                {evento.cupo_total != null && (
                  <div className="detalle-meta-item">
                    <span>👥</span>
                    <span>Capacidad: {evento.cupo_total} personas</span>
                  </div>
                )}
              </div>

              {evento.descripcion && (
                <div className="detalle-description">
                  <h3>Descripción</h3>
                  <p>{evento.descripcion}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar de compra ─────────────────────────── */}
          <aside className="detalle-sidebar">
            {/* Precio */}
            {precioLabel && (
              <p className={`sidebar-price ${evento.precio === 0 ? 'sidebar-price-free' : ''}`}>
                {precioLabel}
              </p>
            )}

            <hr className="sidebar-divider" />

            {/* Botón favorito */}
            {token && (
              <button
                className={`btn-fav${esFavorito ? ' btn-fav-active' : ''}`}
                onClick={handleToggleFavorito}
                disabled={togglingFav}
              >
                {togglingFav ? '...' : esFavorito ? '♥ En favoritos' : '♡ Guardar favorito'}
              </button>
            )}

            {/* Feedback de compra */}
            {compraOk && (
              <div className="alert alert-success">
                ✅ ¡Entrada comprada!{' '}
                <Link to="/mis-entradas">Ver mis entradas →</Link>
              </div>
            )}

            {compraError && (
              <div className="alert alert-error">⚠️ {compraError}</div>
            )}

            {/* Botón / mensaje de login */}
            {!compraOk && (
              token ? (
                <button
                  className="sidebar-btn"
                  onClick={handleComprar}
                  disabled={comprando}
                >
                  {comprando ? 'Procesando...' : '🎟️ Comprar entrada'}
                </button>
              ) : (
                <>
                  <p className="sidebar-login-msg">
                    <Link to="/login">Iniciá sesión</Link> para comprar entradas.
                  </p>
                  <Link to="/login" className="sidebar-btn" style={{ textAlign: 'center' }}>
                    Iniciar sesión
                  </Link>
                </>
              )
            )}

            {/* Info extra en sidebar */}
            <div className="sidebar-info">
              {evento.ubicacion && (
                <div className="sidebar-info-row">
                  <span>📍</span>
                  <span>{evento.ubicacion}</span>
                </div>
              )}
              {fechaFmt && (
                <div className="sidebar-info-row">
                  <span>📅</span>
                  <span>{fechaFmt}</span>
                </div>
              )}
              {evento.categoria && (
                <div className="sidebar-info-row">
                  <span>🏷️</span>
                  <span>{evento.categoria}</span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
