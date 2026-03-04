import { rockGenreArr } from "./genreConstantsArrays";
import parseGenres from "./parseGenres";

describe('Parse genres from userVector to enhance response', () => {
    it("enchances rock with more options when rock is searched", () => {
        const parsedResults = parseGenres(["rock"]);
        expect(parsedResults).toContain(rockGenreArr);
    });
});
