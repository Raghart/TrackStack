import { expect, test } from "@playwright/test";

test.describe("Search", () => {
    test("Search for the songs made by the artist shakira in the search input", async ({ page }) => {
        await page.goto("http://localhost:5173");
        
        const searchInput = page.getByTestId("searchInput");
        await expect(searchInput).toBeVisible();
        await searchInput.fill("Shakira");

        const spotShakira = page.getByTestId("spotArtistCard");
        await expect(spotShakira).toBeVisible();
        await expect(page.getByText("Shakira").first()).toBeVisible();
        await expect(page.getByTestId("spotSongCard")).toBeVisible();
        await expect(page.getByTestId("spotAlbumCard")).toBeVisible();

        await spotShakira.click();
        await expect(page).toHaveURL(/\/artists\/Shakira$/);
        await expect(page.getByText("Artist: Shakira")).toBeVisible();
        await expect(page.getByTestId("Songcard").first()).toBeVisible();
    });
});