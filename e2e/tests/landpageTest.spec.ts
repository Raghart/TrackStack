import { test, expect } from '@playwright/test';

test.describe("Landpage", () => {
  test('front page elements are visible', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText("TrackStack")).toBeVisible();
    await expect(page.getByText("Artists").first()).toBeVisible();
    await expect(page.getByText("Genres")).toBeVisible();
    await expect(page.getByText("Select a Genre")).toBeVisible();
    await expect(page.getByText("Select an Artist")).toBeVisible();
    await expect(page.getByTestId("LaraBtn")).toBeVisible();

    await expect(page.getByTestId("musicPlayer")).toBeVisible();
    await expect(page.getByTestId("PlayBtn")).toBeVisible();
    await expect(page.getByTestId("PrevSongBtn")).toBeVisible();
    await expect(page.getByTestId("NextSongBtn")).toBeVisible();
    await expect(page.getByTestId("Landpage-Cont")).toBeVisible();
    await expect(page.getByText("0:00")).toBeVisible();
    await expect(page.getByText("0:30")).toBeVisible();
  });
});