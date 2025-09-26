import getCSVData from "./getCSVData";
import { Songs } from "./song";
import { Genres } from "./genres";
import { songGenres } from "./songGenres";
import { SongGenresCreationAttributes } from "../../src/types/songGenresAttributes";

const addSongGenres = async () => {
    const csvData = await getCSVData(1, 50230);
    const USongGenresData: SongGenresCreationAttributes[] = [];

    const songs = (await Songs.findAll()).map(songIns => songIns.get({ plain: true }));
    const songMap = new Map(songs.map(song => [song.name, song.id ]));

    const genres = (await Genres.findAll()).map(genreIns => genreIns.get({ plain: true }));
    const genreMap = new Map(genres.map(genre => [genre.genre, genre.id]));
    
    for (const song of csvData) {
        const songID = songMap.get(song.name);
        if (!songID) throw new Error (`Couldnt get the songID: "${songID}" of the song ${song.name}`);

        const genresId = song.tags.map(genre => {
            const ID = genreMap.get(genre);
            if (!ID) throw new Error (`Couldnt get the genreID: "${songID}" of the song ${song.name}`);
            return ID;
        });

        genresId.forEach(genre_id => USongGenresData.push({ song_id: songID, genre_id }));
    };

    try {
        await songGenres.bulkCreate(USongGenresData);
        console.log("The RP between the songs and the genres was successful!");
    } catch (err) {
        console.error("There was an error trying to get the RP", err.message);
    };
};

addSongGenres();