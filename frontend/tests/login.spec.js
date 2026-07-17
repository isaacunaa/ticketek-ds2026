import { test, expect } from '@playwright/test'
import { login, JUAN } from './helpers'

test('login con credenciales correctas redirige al home', async ({ page }) => {
  await login(page, JUAN)
  await expect(page.getByText(`Hola, Juan`)).toBeVisible()
})

test('login con credenciales incorrectas muestra error', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel('Email').fill(JUAN.email)
  await page.getByLabel('Contraseña').fill('password-incorrecta')
  await page.getByRole('button', { name: /Iniciar sesión|Ingresando/ }).click()

  await expect(page.locator('.form-error')).toContainText('Email o contraseña inválidos.')
  await expect(page).toHaveURL('/login')
})
