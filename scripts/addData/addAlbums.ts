import getCSVData from "./getCSVData";
import { Albums } from "./albums";

const addAlbums = async () => {
    const csvData = await getCSVData(1, 50230);
    const AlbumMap = new Map();

    for await (const song of csvData) {
        if (!AlbumMap.has(song.album_name)) {
            const albumObj = { name: song.album_name, url_image: song.album_image_url }
            AlbumMap.set(song.album_name, albumObj);
        }
    };

    const uniqueAlbums = Array.from(AlbumMap.values());
    try {
        await Albums.bulkCreate(uniqueAlbums);
        console.log("Albums added without issue!");
    } catch (err) {
        console.error("There was an error trying to add the album to the DB,", err.message);
    };
};

addAlbums();