import { test, expect } from '@playwright/test'

test('ver catálogo de eventos', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Encontrá tu próximo evento' })).toBeVisible()

  const cards = page.locator('.event-card')
  await expect(cards.first()).toBeVisible()
  await expect(cards).not.toHaveCount(0)

  // El evento del seed usado en el resto de la suite debe estar en el catálogo.
  await expect(page.getByRole('link', { name: /Noche de los Museos 2026/ })).toBeVisible()
})
