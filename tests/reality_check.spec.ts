import { test, expect } from '@playwright/test';

test.describe('M2 Nexus Sovereign Reality Check', () => {
  
  test('Homepage Stability & Branding', async ({ page }) => {
    await page.goto('/');
    // Use title check which is device-agnostic
    await expect(page).toHaveTitle(/M2 NEXUS/i);
    // Banner should be visible on all devices
    await expect(page.getByText(/Sovereign AI Operating System/i).first()).toBeVisible();
    
    // Sidebar check (conditional for mobile)
    const sidebar = page.locator('aside').first();
    const isMobile = await page.evaluate(() => window.innerWidth < 1024);
    
    if (isMobile) {
      await expect(sidebar).toBeHidden();
    } else {
      await expect(sidebar).toBeVisible();
    }
  });

  test('Navigation Categorization (Three-Layer Architecture)', async ({ page }) => {
    await page.goto('/');
    const isMobile = await page.evaluate(() => window.innerWidth < 1024);
    
    if (isMobile) {
      // Toggle menu button (looks for the LayoutDashboard icon in a button)
      const menuButton = page.locator('button').filter({ has: page.locator('svg') }).first();
      await menuButton.click();
      // Wait for animation
      await page.waitForTimeout(500); 
    }
    
    // Now check categorization
    await expect(page.getByText(/CORE OPERATIONS/i).first()).toBeVisible();
    await expect(page.getByText(/INTELLIGENCE/i).first()).toBeVisible();
    await expect(page.getByText(/INNOVATION LABS/i).first()).toBeVisible();
    await expect(page.getByText(/GOVERNANCE/i).first()).toBeVisible();
  });

  test('Mobile Responsiveness: Sidebar Toggle & Content Margin', async ({ page }) => {
    const isMobile = await page.evaluate(() => window.innerWidth < 1024);
    if (!isMobile) return;
    
    await page.goto('/');
    const sidebar = page.locator('aside').first();
    
    // 1. Initially hidden
    await expect(sidebar).toBeHidden();
    
    // 2. Open menu
    const menuButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await menuButton.click();
    await expect(sidebar).toBeVisible();
    
    // 3. Close menu via button again
    await menuButton.click();
    await expect(sidebar).toBeHidden();
  });

  test('Security Hardening: No Leaked API Keys in UI', async ({ page }) => {
    await page.goto('/settings');
    // Allow more time for settings to load sensitive checks
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    
    // Explicitly check for strings that should NOT be in the DOM
    expect(content).not.toContain('GEMINI_API_KEY');
    expect(content).not.toContain('CLERK_SECRET_KEY');
    expect(content).not.toContain('D_ID_API_KEY');
    
    // Check for new safe labels
    await expect(page.getByText(/AI Intelligence Engine/i).first()).toBeVisible();
    await expect(page.getByText(/External Integrations/i).first()).toBeVisible();
  });
});
