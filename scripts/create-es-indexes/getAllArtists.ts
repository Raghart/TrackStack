import { artistSearchResults } from "../../src/types/searchTypes";
import { parseArtistSongs } from "../../src/types/parses";
import { ArtistsModel } from "../../models/artists/artists.model";
import { SongsModel } from "../../models/songs/song.model";
import { AlbumsModel } from "../../models/albums/albums.model";

// Add data to the indexes in ES
export const getArtists = async () : Promise<artistSearchResults[]> => {
    const rawData = await ArtistsModel.findAll({
        include: [
            { model: SongsModel, attributes: ["name"], include: [
                { model: AlbumsModel, attributes: ["url_image"] }
            ] }
        ]
    });

    const data = rawData.map(song => parseArtistSongs(song.get({ plain: true })));
    return data.map(artist => ({
        id: artist.id,
        name: artist.name,
        album_cover: artist.songs[0].album.url_image,
        type: "artist"
    }));  
};