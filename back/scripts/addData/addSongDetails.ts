import getCSVData from "./getCSVData";
import { Songs } from "./song";
import { songDetails } from "./songDetails";
import { SongDetailsCreationAttributes } from "../../src/types/songDetailsAttributes";

const addSongDetails = async () => {
    const csvData = await getCSVData(1, 50230);
    const USongDetailData: SongDetailsCreationAttributes[] = [];
    const songs = (await Songs.findAll()).map(songIns => songIns.get({ plain: true }));
    const songsMap = new Map(songs.map(song => [song.name, song.id]));

    for (const song of csvData) {
        const SongID = songsMap.get(song.name);
        if (!SongID) throw new Error (`Couldnt find the song ID: "${SongID}" for ${song.name}`);

        USongDetailData.push({
            song_id: SongID,
            danceability: song.danceability,
            energy: song.energy,
            track_key: song.track_key,
            loudness: song.loudness,
            mode: song.mode,
            speechiness: song.speechiness,
            acousticness: song.acousticness,
            instrumentalness: song.instrumentalness,
            liveness: song.liveness,
            valence: song.valence,
            tempo: song.tempo,
            time_signature: song.time_signature,
        });
    };

    try {
        await songDetails.bulkCreate(USongDetailData);
        console.log("All the song details were added sucessfully!");
    } catch (err) {
        console.error("There was an error trying to add the details", err.message);
    };
};

addSongDetails();