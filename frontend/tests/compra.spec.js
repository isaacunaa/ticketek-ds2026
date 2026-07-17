import { test, expect } from '@playwright/test'
import { login, irAEvento, EVENTO_GRATIS, JUAN } from './helpers'

test('comprar una entrada requiere estar logueado', async ({ page }) => {
  await irAEvento(page, EVENTO_GRATIS)
  await expect(page.getByText('para comprar entradas.')).toBeVisible()
  await expect(page.locator('.detalle-sidebar').getByRole('link', { name: 'Iniciar sesión' })).toBeVisible()
})

test('comprar una entrada logueado', async ({ page }) => {
  await login(page, JUAN)
  await irAEvento(page, EVENTO_GRATIS)

  await page.getByRole('button', { name: /Comprar entrada/ }).click()

  await expect(page.locator('.alert-success')).toContainText('¡Entrada comprada!')
  await expect(page.getByRole('link', { name: 'Ver mis entradas →' })).toBeVisible()
})
