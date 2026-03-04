import { chillGenreArr, electroGenreArr, jazzGenreArr, metalGenreArr, popGenreArr, rapGenreArr, rockGenreArr, videogameGenreArr } from "./genreConstantsArrays";
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

    it("enchances metal genre with more options when Metal is searched", () => {
        const parsedResults = parseGenres(["Metal"]);
        expect(parsedResults).toStrictEqual(metalGenreArr);
    });

    it("enchances jazz genre with more options when Jazz is searched", () => {
        const parsedResults = parseGenres(["Jazz"]);
        expect(parsedResults).toStrictEqual(jazzGenreArr);
    });

    it("enchances videogame music genre with more options when 'Videogame Music' is searched", () => {
        const parsedResults = parseGenres(["Videogame Music"]);
        expect(parsedResults).toStrictEqual(videogameGenreArr);
    });

    it("enchances chill genre with more options when Chill is searched", () => {
        const parsedResults = parseGenres(["Chill"]);
        expect(parsedResults).toStrictEqual(chillGenreArr);
    });

    it("enchances rap genre with more options when Rap is searched", () => {
        const parsedResults = parseGenres(["Rap"]);
        expect(parsedResults).toStrictEqual(rapGenreArr);
    });

    it("returns the same array if no genre matches the enhanced option", () => {
        const parsedResults = parseGenres(["Disco"]);
        expect(parsedResults).toStrictEqual(["Disco"]);
    });
});
