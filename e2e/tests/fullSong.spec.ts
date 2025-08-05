import { expect, test } from "@playwright/test";

test.describe("Song details path", () => {
  test('users can acess to the full info of a song from the landpage', async ({ page }) => {
    await page.goto('/');

    await page.getByText("Genres").click();
    await page.getByText("00s").click();

    const songcard = page.getByTestId("Songcard").first();
    await page.waitForTimeout(500);
    await expect(songcard).toBeVisible();

    const songName = page.getByTestId("songName").first();
    await expect(songName).not.toHaveText("");
    const name = await songName.innerText();
    await expect(songName).toBeVisible();
    await songName.click();

    expect(page.url()).toContain("/songs/");
    await expect(page.getByText(name).first()).toBeVisible();
    await expect(page.getByText("ALBUM")).toBeVisible();
    await expect(page.getByText("GENRES").first()).toBeVisible();
    await expect(page.getByText("Duration: ")).toBeVisible();
    await expect(page.getByText("Check out the Full Song Here")).toBeVisible();
  });
});