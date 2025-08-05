import { expect, test } from "@playwright/test";

test.describe("Genres Page", () => {
    test("Select a song from from the genre: Love", async ({ page }) => {
        await page.goto("http://localhost:5173/");
        await page.getByText("Genres").click();

        await expect(page).toHaveURL("http://localhost:5173/genres");
        await expect(page.getByText("Select a Genre")).toBeVisible();
        await page.getByText("Love").click();

        await expect(page).toHaveURL("http://localhost:5173/genres/Love");
        await expect(page.getByText("Genre: Love")).toBeVisible();

        const songCard = page.getByTestId("Songcard").first();
        await songCard.hover();
        const playBtn = page.getByTestId("PlaySongBtn").first();
        await expect(playBtn).toBeVisible();

        await playBtn.click();

        const audio = page.getByTestId("AudioPlayer");
        await page.waitForTimeout(500);
        await expect(audio).toHaveJSProperty("paused", false);

        const audioSrc = await audio.getAttribute("src");
        expect(audioSrc).toBeTruthy();

        const currentTime = page.getByTestId("currentTime");
        await expect(currentTime).not.toHaveText("0:00");
    });
});