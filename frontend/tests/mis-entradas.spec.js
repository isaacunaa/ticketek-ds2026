import { test, expect } from '@playwright/test'
import { login, comprarEventoGratis, JUAN } from './helpers'

test('ver mis entradas sin sesión redirige a login', async ({ page }) => {
  await page.goto('/mis-entradas')
  await expect(page).toHaveURL('/login')
})

test('ver mis entradas', async ({ page }) => {
  await login(page, JUAN)
  const titulo = await comprarEventoGratis(page)

  await page.getByRole('link', { name: 'Ver mis entradas →' }).click()

  await expect(page).toHaveURL('/mis-entradas')
  await expect(page.getByRole('heading', { name: 'Mis Entradas' })).toBeVisible()

  const entrada = page.locator('.entrada-card', { hasText: titulo }).first()
  await expect(entrada).toBeVisible()
  await expect(entrada.getByText('Activa')).toBeVisible()
})
