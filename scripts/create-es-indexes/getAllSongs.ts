import { songSearchResults } from "../../src/types/searchTypes";
import { parseSongResponse, parseStringArray, parseString } from "../../src/types/parses";
import { SongsModel } from "../../models/songs/song.model";
import { ArtistsModel } from "../../models/artists/artists.model";
import { AlbumsModel } from "../../models/albums/albums.model";

// Function used to create the indexes in ES
export const getAllSongs = async () : Promise<songSearchResults[]> => {
    const rawData = await SongsModel.findAll({
        include: [
            { model: ArtistsModel, attributes: ["name"], through: { attributes: [] } },
            { model: AlbumsModel, attributes: ["name", "url_image"] },
        ]
    });

    const data = rawData.map(song => parseSongResponse(song.get({ plain: true })));
    return data.map(song => ({ 
        id: song.id,
        name: song.name,
        artists: parseStringArray(song.artists.map(artist => artist.name)),
        album: parseString(song.album.name),
        album_cover: parseString(song.album.url_image),
        url_preview: song.url_preview,
        type: "song",
        }));
};