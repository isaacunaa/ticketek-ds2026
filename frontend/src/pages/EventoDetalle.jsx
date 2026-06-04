import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import client from '../api/client'

const EMOJI = {
  'Música':     '🎵',
  'Humor':      '😂',
  'Teatro':     '🎭',
  'Deportes':   '⚽',
  'Arte':       '🎨',
  'Cine':       '🎬',
  'Tecnología': '💻',
}
const getEmoji = (cat) => EMOJI[cat] ?? '🎉'

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
  const nombre = evento.nombre || evento.titulo || 'Sin nombre'
  const emoji  = getEmoji(evento.categoria)

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
            {/* Placeholder imagen */}
            <div className="detalle-placeholder">{emoji}</div>

            <div className="detalle-content">
              {evento.categoria && (
                <div className="event-badges">
                  {evento.categoria.split(',').map(c => c.trim()).map(c => (
                    <span key={c} className="detalle-badge">{c}</span>
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
                {evento.cupo_disponible != null && (
                  <div className="detalle-meta-item">
                    <span>👥</span>
                    <span>Lugares disponibles: {evento.cupo_disponible}</span>
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

          </aside>
        </div>
      </div>
    </div>
  )
}
