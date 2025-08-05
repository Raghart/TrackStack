import { test, expect } from "@playwright/test";

test.describe("Recommendation modal", () => {
    test("User prepares recommendation modal with 'Love' and 'Mellow' genres", async ({ page }) => {
        await page.goto("http://localhost:5173/");
        await page.getByTestId("LaraBtn").click();

        await expect(page.getByText("Lara Takes Over")).toBeVisible();
        await expect(page.getByText("Filter by Genre")).toBeVisible();
        await expect(page.getByTestId("LaraSendBtn")).toBeVisible();

        const genreInput = page.getByTestId("GenreInput");
        await expect(genreInput).toBeVisible();
        await genreInput.fill("Love");
        await genreInput.press("Enter");

        await genreInput.fill("Mellow");
        await genreInput.press("Enter");

        const sendDataBtn = page.getByTestId("LaraSendBtn");
        await expect(sendDataBtn).toBeVisible();
        await expect(sendDataBtn).toBeEnabled();
    });
});