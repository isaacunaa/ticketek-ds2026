import { test, expect } from '@playwright/test'

test('registro de usuario nuevo redirige a login', async ({ page }) => {
  const email = `e2e.${Date.now()}@test.com`

  await page.goto('/register')

  await page.getByLabel('Nombre').fill('Playwright')
  await page.getByLabel('Apellido').fill('Tester')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Contraseña').fill('Test1234')
  await page.getByRole('button', { name: /Crear cuenta|Creando cuenta/ }).click()

  await expect(page).toHaveURL('/login')
  await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible()
})
