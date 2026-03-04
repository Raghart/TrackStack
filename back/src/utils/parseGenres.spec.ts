import { rockGenreArr } from "./genreConstantsArrays";
import parseGenres from "./parseGenres";

describe('Parse genres from userVector to enhance response', () => {
    it("enchances rock with more options when rock is searched", () => {
        const parsedResults = parseGenres(["Rock"]);
        expect(parsedResults).toStrictEqual(rockGenreArr);
    });

    it("returns the same array if no genre matches the enhanced option", () => {
        const parsedResults = parseGenres(["Disco"]);
        expect(parsedResults).toStrictEqual(["Disco"]);
    });
});
