import { SongCreationAttributes } from "../../src/types/songAttributes";
import getCSVData from "./getCSVData"
import { Albums } from "./albums";
import { Songs } from "./song";
import { AlbumAttributes } from "../../src/types/albumAttributes";

const addSongs = async () => {
    const csvData = await getCSVData(1, 50230);
    const uniqueSongs: SongCreationAttributes[] = [];
    const albums: AlbumAttributes[] = (await Albums.findAll()).map(album => album.get({ plain: true }) );
    const albumMap = new Map(albums.map(album => [album.name, album.id]));

    for (const song of csvData) {
         const albumID = albumMap.get(song.album_name);
        if (!albumID) throw new Error(`Album not found: ${song.album_name}`);

        const duration = Math.round((song.duration_ms / 60000) * 100) / 100;

        if (duration < 0 || duration > 500) {
            throw new Error(`Invalid duration (${duration}) for song: ${song.name}`);
        }

        if (!song.name || !song.spotify_id || !song.year) {
            throw new Error(`Missing essential data for song: ${song.name}`);
        }

        uniqueSongs.push({
            name: song.name,
            spotify_id: song.spotify_id,
            url_preview: song.spotify_preview_url,
            year: song.year,
            duration,
            album_id: albumID
        });
    };

    try {
        await Songs.bulkCreate(uniqueSongs);
        console.log("All songs added sucessfully!");
    } catch (err) {
        console.error("There was an error trying to add the Songs", err.message);
        console.error(err.stack);
    };
};

addSongs();