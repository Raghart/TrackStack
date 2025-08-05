import { expect, test } from "@playwright/test";
import dotenv from "dotenv"; dotenv.config();

test.describe("Artist path", () => {
    test("Select an artist to watch his songs", async ({ page }) => {
        await page.goto("/");
        await page.getByText("Artists").click();

        await expect(page).toHaveURL("/artists");

        await page.getByTestId("ArtistCard").first().click();
        expect(page.url()).toContain("/artists/");

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