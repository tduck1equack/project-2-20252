import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should show login page', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
        await expect(page.getByLabel(/email/i)).toBeVisible();
        await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test('should show validation errors on empty submit', async ({ page }) => {
        await page.goto('/login');
        await page.getByRole('button', { name: /sign in/i }).click();
        // Expect validation message
        await expect(page.locator('text=required').first()).toBeVisible({ timeout: 5000 });
    });

    test('should navigate to register page', async ({ page }) => {
        await page.goto('/login');
        await page.getByRole('link', { name: /register/i }).click();
        await expect(page).toHaveURL(/\/register/);
    });

    test('should login with demo credentials', async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel(/email/i).fill('customer@demo.com');
        await page.getByLabel(/password/i).fill('password123');
        await page.getByRole('button', { name: /sign in/i }).click();

        // Should redirect to customer dashboard
        await expect(page).toHaveURL(/\/customer/, { timeout: 10000 });
    });
});
