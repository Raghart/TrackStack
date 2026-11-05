import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import {
  albumSearchResults,
  artistSearchResults,
  multipleSearchResults,
  songSearchResults,
} from '@/types/searchTypes';
import { parseAlbumSearchData, parseArtistSearchData, parseSongSearchData } from '@/types/parses';
import safeQuery from '@/utils/safeQuery';
import { ArtistsModel } from '../../models/artists/artists.model';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongsModel } from '../../models/songs/song.model';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(ArtistsModel) private artistModel: typeof ArtistsModel,
    @InjectModel(AlbumsModel) private albumModel: typeof AlbumsModel,
    @InjectModel(SongsModel) private songModel: typeof SongsModel,
  ) {}

  async searchArtists(query: string): Promise<artistSearchResults[]> {
    const results = await safeQuery(() =>
      this.artistModel.sequelize!.query<
        Pick<artistSearchResults, 'id' | 'name' | 'album_cover'>
      >(`SELECT id, name, album_cover FROM search_artists(:query, :limit);`, {
        type: QueryTypes.SELECT,
        replacements: { query, limit: 11 },
      }),
    );

    return results.map((artist) => parseArtistSearchData({ ...artist, type: 'artist' }));
  }

  async searchAlbums(query: string): Promise<albumSearchResults[]> {
    const results = await safeQuery(() => 
      this.albumModel.sequelize!.query<
      Pick<albumSearchResults, "id" |"name" | "album_cover" | "artists" | "type">
    >(`SELECT id, name, album_cover, artists FROM search_albums(:query, :limit);`, {
      type: QueryTypes.SELECT,
      replacements: { query, limit: 11 },
    })
    );

    return results.map((album) => parseAlbumSearchData({...album, type: "album"}))
  }

  async seachSongs(query: string): Promise<songSearchResults[]> {
    const results = await safeQuery(() => 
      this.songModel.sequelize!.query<
      Pick<songSearchResults, "id" | "name" | "album" | "url_preview" | 
        "album_cover" | "artists" | "type">
    >(`SELECT id, name, album, album_cover, artists, url_preview FROM search_songs(:query, :limit);`, {
      type: QueryTypes.SELECT,
      replacements: { query, limit: 11 },
    })
    );
    
    return results.map((song) => parseSongSearchData({ ...song, type: "song" }));
  }

  async multipleSearch(query: string): Promise<multipleSearchResults> {
    const [exactArtist, ...artistResults] = await this.searchArtists(query);
    const [exactAlbum, ...albumResults] = await this.searchAlbums(query);
    const [exactSong, ...songResults] = await this.seachSongs(query);

    return {
      exactArtist,
      exactAlbum,
      exactSong,
      artistResults,
      albumResults,
      songResults,
    };
  }
}
