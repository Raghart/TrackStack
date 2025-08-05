import { expect, test } from "@playwright/test";

test.describe("Artist path", () => {
    test("Select an artist to watch his songs", async ({ page }) => {
        await page.goto("http://localhost:5173/");
        await page.getByText("Artists").click();

        await expect(page).toHaveURL("http://localhost:5173/artists");

        await page.getByTestId("ArtistCard").first().click();
        await expect(page).toHaveURL(/^http:\/\/localhost:5173\/artists/);

        const song = page.getByTestId("Songcard").first();
        await expect(song).toBeVisible();
        await song.hover();

        const PlayBtn = page.getByTestId("PlaySongBtn").first();
        await expect(PlayBtn).toBeVisible();
        await PlayBtn.click();

        const audio = page.getByTestId("AudioPlayer");
        await page.waitForTimeout(1000);
        await expect(audio).toHaveJSProperty("paused", false);

        const audioSrc = await audio.getAttribute("src");
        expect(audioSrc).toBeTruthy();
    });
});