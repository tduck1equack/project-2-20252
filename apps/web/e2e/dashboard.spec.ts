
import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/admin');
    });

    test('should render dashboard title', async ({ page }) => {
        await expect(page).toHaveTitle(/ERP System/);
    });

    test('should render stat cards', async ({ page }) => {
        // Looking for "Total Inventory" text inside a card
        await expect(page.getByText('Total Inventory')).toBeVisible();
        await expect(page.getByText('Active Batches')).toBeVisible();
    });

    test('should navigate to Inventory Visualization', async ({ page }) => {
        await page.click('a[href="/admin/inventory"]');
        await expect(page).toHaveURL('/admin/inventory');
        await expect(page.getByRole('heading', { name: 'Warehouse Visualization' })).toBeVisible();

        // Check if canvas exists (canvas element from Three.js)
        await expect(page.locator('canvas')).toBeVisible();
    });
});
