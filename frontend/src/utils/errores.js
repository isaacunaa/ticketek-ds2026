/* Convierte errores crudos del backend (Go validator) a mensajes legibles */

const FIELD_LABEL = {
  email:    'El email',
  password: 'La contraseña',
  nombre:   'El nombre',
  apellido: 'El apellido',
}

const TAG_MSG = {
  required: 'es obligatorio.',
  email:    'no tiene un formato válido.',
  min:      'es demasiado corto.',
  max:      'es demasiado largo.',
  alphanum: 'solo puede contener letras y números.',
}

export const parsearErrorAPI = (error) => {
  if (!error || typeof error !== 'string') return 'Ocurrió un error inesperado.'

  // Si ya es un mensaje legible (sin patrón de Go validator), lo devolvemos tal cual
  if (!error.includes("Key:") && !error.includes("Field validation")) {
    return error
  }

  // Parsea: Key: 'Struct.Field' Error:Field validation for 'Field' failed on the 'tag' tag
  const fieldMatch = error.match(/Key:\s*'[^.]+\.(\w+)'/)
  const tagMatch   = error.match(/failed on the '(\w+)' tag/)

  if (fieldMatch && tagMatch) {
    const field = fieldMatch[1].toLowerCase()
    const tag   = tagMatch[1]
    const label = FIELD_LABEL[field] ?? `El campo ${field}`
    const msg   = TAG_MSG[tag]
    if (msg) return `${label} ${msg}`
  }

  return 'Verificá los datos ingresados e intentá de nuevo.'
}
