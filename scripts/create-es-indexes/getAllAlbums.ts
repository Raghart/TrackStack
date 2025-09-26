import { AlbumsModel } from "../../models/albums/albums.model";
import { ArtistsModel } from "../../models/artists/artists.model";
import { SongsModel } from "../../models/songs/song.model";
import { albumSearchResults } from "../../src/types/searchTypes";
import { parseAlbumSong } from "../../src/types/parses";

// Function to index the data in ES
export const getAllAlbums = async () : Promise<albumSearchResults[]> => {
    const rawData = await AlbumsModel.findAll({
        include: [
            { model: SongsModel, attributes: ["name"], include: [
                { model: ArtistsModel, attributes: ["name"], through: { attributes: [] } },
            ] }
        ]
    });

    const data = rawData.map(album => parseAlbumSong(album.get({ plain: true })));

    return data.map(album => {
        const artistSet = new Set<string>();
        album.songs.forEach(a => a.artists.forEach(artist => artistSet.add(artist.name) ));
        return {
            id: album.id,
            name: album.name,
            artists: [...artistSet],
            album_cover: album.url_image,
            type: "album",
        };
    });
};