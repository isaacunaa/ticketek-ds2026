import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { getImagenEvento, normalizarCategorias } from '../utils/eventos'

const CATEGORIAS = ['Todos', 'Música', 'Humor', 'Teatro', 'Deportes', 'Arte']

/* ── EventCard ───────────────────────────────────────────── */
function EventCard({ evento, isFavorito, onToggleFav }) {
  const token    = localStorage.getItem('token')
  const nombre    = evento.titulo || 'Sin nombre'
  const imagenUrl = getImagenEvento(evento)
  const categorias = normalizarCategorias(evento.categoria)
  const [toggling, setToggling] = useState(false)

  const fecha = evento.fecha_hora
    ? new Date(evento.fecha_hora).toLocaleDateString('es-AR', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : null

  const precioLabel =
    evento.precio == null ? null :
    evento.precio === 0   ? 'Gratis' :
    `$${Number(evento.precio).toLocaleString('es-AR')}`

  const handleFav = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setToggling(true)
    try { await onToggleFav(evento.id, isFavorito) }
    finally { setToggling(false) }
  }

  return (
    <Link to={`/eventos/${evento.id}`} className="event-card">
      <div className="event-img-wrap">
        <img src={imagenUrl} alt={nombre} className="event-img" loading="lazy" />
        {token && (
          <button
            className={`card-fav-btn${isFavorito ? ' card-fav-active' : ''}`}
            onClick={handleFav}
            disabled={toggling}
            title={isFavorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          >
            {toggling ? '·' : isFavorito ? '♥' : '♡'}
          </button>
        )}
      </div>

      <div className="event-body">
        {categorias.length > 0 && (
          <div className="event-badges">
            {categorias.map((cat) => (
              <span key={cat} className="event-category-badge">{cat}</span>
            ))}
          </div>
        )}
        <h3 className="event-title">{nombre}</h3>
        {evento.ubicacion && <p className="event-venue">📍 {evento.ubicacion}</p>}
        {fecha            && <p className="event-date">📅 {fecha}</p>}
        {precioLabel      && (
          <p style={{ fontWeight: 700, color: 'var(--accent-dark)', fontSize: '.92rem', marginTop: '.2rem' }}>
            {precioLabel}
          </p>
        )}
      </div>

      <div className="event-footer">
        <span className="btn-buy">Comprar entradas</span>
      </div>
    </Link>
  )
}

/* ── Home ────────────────────────────────────────────────── */
export default function Home() {
  const token = localStorage.getItem('token')

  const [eventos,   setEventos]   = useState([])
  const [favIds,    setFavIds]    = useState(new Set())
  const [search,    setSearch]    = useState('')
  const [categoria, setCategoria] = useState('Todos')
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')

  const inputRef = useRef(null)

  const fetchEventos = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (search.trim())         params.search    = search.trim()
      if (categoria !== 'Todos') params.categoria = categoria

      const { data } = await client.get('/eventos', { params })
      const lista = Array.isArray(data) ? data : data.eventos ?? data.data ?? []
      setEventos(lista)
    } catch (err) {
      setError('No se pudieron cargar los eventos. Verificá que el backend esté corriendo en http://localhost:8080.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search, categoria])

  useEffect(() => { fetchEventos() }, [categoria]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setTimeout(() => { fetchEventos() }, 400)
    return () => clearTimeout(t)
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  // Carga favoritos si hay sesión
  useEffect(() => {
    if (!token) return
    client.get('/favoritos')
      .then(({ data }) => {
        const ids = (data.favoritos ?? []).map((f) => f.evento_id)
        setFavIds(new Set(ids))
      })
      .catch(() => {})
  }, [token])

  const handleToggleFav = async (eventoId, esFavorito) => {
    try {
      if (esFavorito) {
        await client.delete(`/favoritos/${eventoId}`)
        setFavIds((prev) => { const s = new Set(prev); s.delete(eventoId); return s })
      } else {
        await client.post(`/favoritos/${eventoId}`)
        setFavIds((prev) => new Set([...prev, eventoId]))
      }
    } catch {
      // silencioso
    }
  }

  const handleClearFilters = () => {
    setSearch('')
    setCategoria('Todos')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      <section className="hero">
        <h1 className="hero-title">Encontrá tu próximo evento</h1>
        <p className="hero-subtitle">Música, teatro, deporte y mucho más</p>

        <div className="hero-search">
          <input
            ref={inputRef}
            type="text"
            className="hero-search-input"
            placeholder="Buscar eventos..."
            defaultValue={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="hero-search-icon">🔍</span>
        </div>
      </section>

      <div className="category-bar">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            className={`category-tab${categoria === cat ? ' active' : ''}`}
            onClick={() => setCategoria(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <section className="events-section">
        {loading && (
          <div className="state-box">
            <span className="spinner" />
            <p>Cargando eventos...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-box" style={{ color: 'var(--danger)' }}>
            <p>⚠️ {error}</p>
            <button className="btn-retry" onClick={fetchEventos}>Reintentar</button>
          </div>
        )}

        {!loading && !error && eventos.length === 0 && (
          <div className="state-box">
            <p>🎭 No se encontraron eventos con esos filtros.</p>
            <button className="btn-retry" onClick={handleClearFilters}>
              Limpiar filtros
            </button>
          </div>
        )}

        {!loading && !error && eventos.length > 0 && (
          <>
            <p className="events-count">
              {eventos.length} evento{eventos.length !== 1 ? 's' : ''} encontrado{eventos.length !== 1 ? 's' : ''}
            </p>
            <div className="events-grid">
              {eventos.map((ev) => (
                <EventCard
                  key={ev.id}
                  evento={ev}
                  isFavorito={favIds.has(ev.id)}
                  onToggleFav={handleToggleFav}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}
