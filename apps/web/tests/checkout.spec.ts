import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.getByLabel(/email/i).fill('customer@demo.com');
        await page.getByLabel(/password/i).fill('password123');
        await page.getByRole('button', { name: /sign in/i }).click();
        await expect(page).toHaveURL(/\/customer/, { timeout: 10000 });
    });

    test('should view products page', async ({ page }) => {
        await page.goto('/customer/products');
        await expect(page.getByRole('heading', { name: /products/i })).toBeVisible();
    });

    test('should add item to cart', async ({ page }) => {
        await page.goto('/customer/products');

        // Click first "Add to Cart" button
        const addButton = page.getByRole('button', { name: /add to cart/i }).first();
        await addButton.click();

        // Navigate to cart
        await page.goto('/customer/cart');
        await expect(page.getByRole('heading', { name: /cart/i })).toBeVisible();
    });

    test('should complete checkout flow', async ({ page }) => {
        await page.goto('/customer/products');

        // Add item
        await page.getByRole('button', { name: /add to cart/i }).first().click();

        // Go to cart
        await page.goto('/customer/cart');

        // Proceed to checkout
        await page.getByRole('link', { name: /checkout/i }).click();
        await expect(page).toHaveURL(/\/customer\/checkout/);

        // Place order
        await page.getByRole('button', { name: /place order/i }).click();

        // Should show success or order confirmation
        await expect(page.locator('text=/order|success/i').first()).toBeVisible({ timeout: 10000 });
    });

    test('should view order history', async ({ page }) => {
        await page.goto('/customer/orders');
        await expect(page.getByRole('heading', { name: /orders/i })).toBeVisible();
    });
});
