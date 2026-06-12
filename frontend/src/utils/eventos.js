/* Imágenes por categoría — Unsplash (hotlink directo, no requiere API key) */
const CATEGORY_IMAGES = {
  'Música':     'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop&auto=format',
  'Deportes':   'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=400&fit=crop&auto=format',
  'Humor':      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&h=400&fit=crop&auto=format',
  'Teatro':     'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=400&fit=crop&auto=format',
  'Arte':       'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop&auto=format',
  'Cine':       'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop&auto=format',
  'Tecnología': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&auto=format',
}

/* Normaliza categorías del backend (ej. "musica" → "Música") */
const NORMALIZAR = {
  musica: 'Música', música: 'Música',
  deportes: 'Deportes', deporte: 'Deportes',
  humor: 'Humor',
  teatro: 'Teatro',
  arte: 'Arte', espectaculo: 'Arte', espectáculo: 'Arte',
  cine: 'Cine',
  tecnologia: 'Tecnología', tecnología: 'Tecnología',
}

export const normalizarCategoria = (cat) => {
  if (!cat) return ''
  return NORMALIZAR[cat.toLowerCase()] ?? cat
}

/* Devuelve un array de categorías (soporta valores separados por coma) */
export const normalizarCategorias = (cat) => {
  if (!cat) return []
  return cat.split(',').map((c) => normalizarCategoria(c.trim())).filter(Boolean)
}

/* Devuelve la URL de imagen a mostrar para un evento */
export const getImagenEvento = (evento) => {
  if (evento.imagen_url && !evento.imagen_url.includes('placehold')) {
    return evento.imagen_url
  }
  const cat = normalizarCategoria(evento.categoria)
  return CATEGORY_IMAGES[cat] ?? CATEGORY_IMAGES['Arte']
}

export const EMOJI_MAP = {
  'Música':     '🎵',
  'Humor':      '😂',
  'Teatro':     '🎭',
  'Deportes':   '⚽',
  'Arte':       '🎨',
  'Cine':       '🎬',
  'Tecnología': '💻',
}
export const getEmoji = (cat) => EMOJI_MAP[normalizarCategoria(cat)] ?? '🎉'
