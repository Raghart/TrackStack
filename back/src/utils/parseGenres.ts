import { chillGenreArr, electroGenreArr, jazzGenreArr, metalGenreArr, popGenreArr, rapGenreArr, rockGenreArr, 
    videogameGenreArr} from "./genreConstantsArrays";

const parseGenres = (genres: string[]) : string[] => {
    var genresEnchanced = genres;

    if (genres.some(genre => genre.includes("Rock"))) {
        pushGenres(genresEnchanced, rockGenreArr);
    };

    if (genres.some(genre => genre.includes("Pop"))) {
        pushGenres(genresEnchanced, popGenreArr);
    };

    if (genres.some(genre => genre.includes("Electro"))) {
        pushGenres(genresEnchanced, electroGenreArr);
    };

    if (genres.some(genre => genre.includes("Metal"))) {
        pushGenres(genresEnchanced, metalGenreArr);
    };

    if (genres.some(genre => genre.includes("Jazz"))) {
        pushGenres(genresEnchanced, jazzGenreArr);
    };

    if (genres.some(genre => genre.includes("Videogame Music"))) {
        pushGenres(genresEnchanced, videogameGenreArr);
    }

    if (genres.some(genre => genre.includes("Chill"))) {
        pushGenres(genresEnchanced, chillGenreArr);
    };

    if (genres.some(genre => genre.includes("Rap"))) {
        pushGenres(genresEnchanced, rapGenreArr);
    };
    
    return genresEnchanced;
}

const pushGenres = (genreArr: string[], genresToAdd: string[]) => {
    genresToAdd.forEach(rockGenre => {
        if (!genreArr.some(g => g === rockGenre)) {
            genreArr.push(rockGenre);
        }
    })
};

export default parseGenres;