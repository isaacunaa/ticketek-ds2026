import { expect } from '@playwright/test'

export const JUAN = { email: 'juan@mail.com', password: '123456' }

// Evento del seed con precio $0 y cupo prácticamente ilimitado (999999),
// así el flujo de compra no agota stock ni maneja selector de cantidad.
export const EVENTO_GRATIS = 'Noche de los Museos 2026'

export async function login(page, { email, password } = JUAN) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Contraseña').fill(password)
  await page.getByRole('button', { name: /Iniciar sesión|Ingresando/ }).click()
  await expect(page).toHaveURL('/')
}

// Busca un evento por título en el home y entra a su detalle.
export async function irAEvento(page, titulo) {
  await page.goto('/')
  await page.getByPlaceholder('Buscar eventos...').fill(titulo)
  const link = page.getByRole('link', { name: new RegExp(titulo) })
  await expect(link).toBeVisible()
  await link.click()
  await expect(page).toHaveURL(/\/eventos\/\d+/)
}

// Requiere sesión iniciada. Compra el evento gratis del seed y devuelve
// el título usado, para que el test que llama pueda verificarlo después.
export async function comprarEventoGratis(page) {
  await irAEvento(page, EVENTO_GRATIS)
  await page.getByRole('button', { name: /Comprar entrada/ }).click()
  await expect(page.locator('.alert-success')).toContainText('Entrada comprada')
  return EVENTO_GRATIS
}
