import { electroGenreArr, popGenreArr, rockGenreArr } from "./genreConstantsArrays";
import parseGenres from "./parseGenres";

describe('Parse genres from userVector to enhance response', () => {
    it("enchances rock with more options when rock is searched", () => {
        const parsedResults = parseGenres(["Rock"]);
        expect(parsedResults).toStrictEqual(rockGenreArr);
    });

    it("enchances pop genre with more options when Pop is searched", () => {
        const parsedResults = parseGenres(["Pop"]);
        expect(parsedResults).toStrictEqual(popGenreArr);
    });

    it("enchances electro genre with more options when Electro is searched", () => {
        const parsedResults = parseGenres(["Electro"]);
        expect(parsedResults).toStrictEqual(electroGenreArr);
    });

    it("returns the same array if no genre matches the enhanced option", () => {
        const parsedResults = parseGenres(["Disco"]);
        expect(parsedResults).toStrictEqual(["Disco"]);
    });
});
