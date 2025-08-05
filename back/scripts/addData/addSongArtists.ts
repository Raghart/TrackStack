import getCSVData from "./getCSVData"
import { Songs } from "./song";
import { Artists } from "./artists";
import { SongArtists } from "./songArtists";
import { SongArtistsCreationAttributes } from "../../src/types/songArtistsAttributes";

const addSongArtists = async () => {
    const csvData = await getCSVData(1,50230);
    const USongArtistsData: SongArtistsCreationAttributes[] = []
    
    const songData = (await Songs.findAll()).map(songIns => songIns.get({ plain: true }));
    const songMap = new Map(songData.map(song => [song.name, song.id]));

    const artistData = (await Artists.findAll()).map(songIns => songIns.get({ plain: true }));
    const artistMap = new Map(artistData.map(artist => [artist.name, artist.id]));

    for (const song of csvData) {
        const songID = songMap.get(song.name);
        if (!songID) throw new Error(`There was an error with the ID "${songID}" of the song: "${song.name}"`)

        const songArtists: string[] = song.artist.split(",").map(artist => artist.trim());
        const artistIDs = songArtists.map(artist => {
            const ID = artistMap.get(artist);
            if (!ID) throw new Error(`There was an error with the artist ID "${ID}" of the song: "${song.name}"`)
            return ID;
        });

        artistIDs.forEach(artist_id => USongArtistsData.push({ song_id: songID, artist_id }));
    };

    try {
        await SongArtists.bulkCreate(USongArtistsData);
        console.log("The RP between songs and artists was sucessfully accomplished!");
    } catch (err) {
        console.error("There was an error trying to establish the RP:", err.message);
    };
};

addSongArtists()