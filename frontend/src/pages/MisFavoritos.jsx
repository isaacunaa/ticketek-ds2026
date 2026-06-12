import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { getImagenEvento, normalizarCategorias } from '../utils/eventos'

function FavoritoCard({ favorito, onQuitar }) {
  const [quitando, setQuitando] = useState(false)
  const evento    = favorito.evento || {}
  const nombre     = evento.titulo || `Evento #${favorito.evento_id}`
  const imagenUrl  = getImagenEvento(evento)
  const categorias = normalizarCategorias(evento.categoria)

  const fechaFmt = evento.fecha_hora
    ? new Date(evento.fecha_hora).toLocaleDateString('es-AR', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      })
    : null

  const precioLabel =
    evento.precio == null ? null :
    evento.precio === 0   ? 'Gratis' :
    `$${Number(evento.precio).toLocaleString('es-AR')}`

  const handleQuitar = async () => {
    setQuitando(true)
    try { await onQuitar(favorito.evento_id) }
    finally { setQuitando(false) }
  }

  return (
    <div className="fav-card">
      <Link to={`/eventos/${favorito.evento_id}`} className="fav-card-link">
        <img src={imagenUrl} alt={nombre} className="fav-card-img" loading="lazy" />
        <div className="fav-card-body">
          {categorias.length > 0 && (
            <div className="event-badges">
              {categorias.map((cat) => (
                <span key={cat} className="event-category-badge">{cat}</span>
              ))}
            </div>
          )}
          <p className="fav-card-title">{nombre}</p>
          {fechaFmt  && <p className="fav-card-meta">📅 {fechaFmt}</p>}
          {evento.ubicacion && <p className="fav-card-meta">📍 {evento.ubicacion}</p>}
          {precioLabel && <p className="fav-card-meta">💰 {precioLabel}</p>}
        </div>
      </Link>
      <div className="fav-card-footer">
        <button
          className="btn-action btn-action-cancel"
          onClick={handleQuitar}
          disabled={quitando}
        >
          {quitando ? '...' : '♥ Quitar'}
        </button>
      </div>
    </div>
  )
}

export default function MisFavoritos() {
  const [favoritos, setFavoritos] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [feedback,  setFeedback]  = useState(null)

  const fetchFavoritos = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await client.get('/favoritos')
      setFavoritos(data.favoritos ?? [])
    } catch (err) {
      setError('No se pudieron cargar tus favoritos.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchFavoritos() }, [fetchFavoritos])

  const handleQuitar = async (eventoId) => {
    try {
      await client.delete(`/favoritos/${eventoId}`)
      setFeedback({ type: 'success', msg: 'Evento quitado de favoritos.' })
      fetchFavoritos()
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.error || 'No se pudo quitar el favorito.',
      })
    }
  }

  return (
    <div className="mis-fav-page">
      <div className="mis-fav-inner">
        <div className="page-title-row">
          <h1>Mis Favoritos</h1>
          <Link to="/" className="btn-pill btn-pill-outline" style={{ fontSize: '.85rem', padding: '7px 16px' }}>
            Ver eventos
          </Link>
        </div>

        {feedback && (
          <div className={`alert alert-${feedback.type}`}>
            {feedback.type === 'success' ? '✅' : '⚠️'} {feedback.msg}
            <button className="alert-close" onClick={() => setFeedback(null)}>✕</button>
          </div>
        )}

        {loading && (
          <div className="state-box">
            <span className="spinner" />
            <p>Cargando tus favoritos...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-box" style={{ color: 'var(--danger)' }}>
            <p>⚠️ {error}</p>
            <button className="btn-retry" onClick={fetchFavoritos}>Reintentar</button>
          </div>
        )}

        {!loading && !error && favoritos.length === 0 && (
          <div className="state-box">
            <p>♥ Todavía no guardaste ningún evento como favorito.</p>
            <Link to="/" className="btn-pill btn-pill-solid" style={{ fontSize: '.875rem' }}>
              Ver eventos disponibles
            </Link>
          </div>
        )}

        {!loading && !error && favoritos.length > 0 && (
          <div className="fav-grid">
            {favoritos.map((fav) => (
              <FavoritoCard
                key={fav.evento_id}
                favorito={fav}
                onQuitar={handleQuitar}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
