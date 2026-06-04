import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'

/* ── Mapeo categoría → emoji ─────────────────────────────── */
const EMOJI = {
  'música':      '🎵',
  'humor':       '😂',
  'teatro':      '🎭',
  'deportes':    '⚽',
  'arte':        '🎨',
  'cine':        '🎬',
  'tecnología':  '💻',
  'espectáculo': '🎪',
}
const getEmoji = (cat) => {
  if (!cat) return '🎉'
  const cats = cat.split(',').map(c => c.trim().toLowerCase())
  for (const c of cats) { if (EMOJI[c]) return EMOJI[c] }
  return '🎉'
}

const CATEGORIAS = [
  { label: 'Todos',        value: 'Todos' },
  { label: 'Música',       value: 'música' },
  { label: 'Humor',        value: 'humor' },
  { label: 'Teatro',       value: 'teatro' },
  { label: 'Deportes',     value: 'deportes' },
  { label: 'Arte',         value: 'arte' },
  { label: 'Espectáculo',  value: 'espectáculo' },
]

/* ── EventCard ───────────────────────────────────────────── */
function EventCard({ evento }) {
  const nombre = evento.nombre || evento.titulo || 'Sin nombre'
  const emoji  = getEmoji(evento.categoria)

  const fecha = evento.fecha
    ? new Date(evento.fecha).toLocaleDateString('es-AR', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : null

  const precioLabel =
    evento.precio == null ? null :
    evento.precio === 0   ? 'Gratis' :
    `$${Number(evento.precio).toLocaleString('es-AR')}`

  return (
    <Link to={`/eventos/${evento.id}`} className="event-card">
      {/* Placeholder de imagen */}
      <div className="event-placeholder">{emoji}</div>

      <div className="event-body">
        {evento.categoria && (
          <div className="event-badges">
            {evento.categoria.split(',').map(c => c.trim()).map(c => (
              <span key={c} className="event-category-badge">{c}</span>
            ))}
          </div>
        )}
        <h3 className="event-title">{nombre}</h3>
        {evento.lugar && <p className="event-venue">📍 {evento.lugar}</p>}
        {fecha         && <p className="event-date">📅 {fecha}</p>}
        {precioLabel   && (
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
  const [eventos,   setEventos]   = useState([])
  const [search,    setSearch]    = useState('')
  const [categoria, setCategoria] = useState(CATEGORIAS[0])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')

  // Ref para el input del hero
  const inputRef = useRef(null)

  const fetchEventos = useCallback(async (searchVal, catVal) => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (searchVal.trim()) params.search = searchVal.trim()

      const { data } = await client.get('/eventos', { params })
      let lista = Array.isArray(data)
        ? data
        : data.eventos ?? data.data ?? []

      if (catVal !== 'Todos') {
        lista = lista.filter(ev => {
          if (!ev.categoria) return false
          return ev.categoria.split(',').map(c => c.trim()).includes(catVal)
        })
      }

      setEventos(lista)
    } catch (err) {
      setError('No se pudieron cargar los eventos. Verificá que el backend esté corriendo en http://localhost:8080.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch cuando cambia la categoría (inmediato)
  useEffect(() => {
    fetchEventos(search, categoria.value)
  }, [categoria.value]) // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce del buscador (400 ms)
  useEffect(() => {
    const t = setTimeout(() => { fetchEventos(search, categoria.value) }, 400)
    return () => clearTimeout(t)
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClearFilters = () => {
    setSearch('')
    setCategoria(CATEGORIAS[0])
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero">
        <h1 className="hero-title">Encontrá tu próximo evento</h1>
        <p className="hero-subtitle">Eventos que atrapan</p>

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

      {/* ── Barra de categorías ───────────────────────────── */}
      <div className="category-bar">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.value}
            className={`category-tab${categoria.value === cat.value ? ' active' : ''}`}
            onClick={() => setCategoria(cat)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Grilla de eventos ─────────────────────────────── */}
      <section className="events-section">
        {/* Estados */}
        {loading && (
          <div className="state-box">
            <span className="spinner" />
            <p>Cargando eventos...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-box" style={{ color: 'var(--danger)' }}>
            <p>⚠️ {error}</p>
            <button className="btn-retry" onClick={() => fetchEventos(search, categoria.value)}>Reintentar</button>
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
                <EventCard key={ev.id} evento={ev} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}
