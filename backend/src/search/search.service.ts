import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { AlbumSearchResultData, albumSearchResultSchema, 
  ArtistSearchResultData, artistSearchResultSchema, multipleSearchResults, multipleSearchResultsSchema, SongSearchResultData, songSearchResultSchema } from '@trackstack/schemas';
import safeQuery from '@/utils/safeQuery';
import { ArtistsModel } from '../../models/artists/artists.model';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongsModel } from '../../models/songs/song.model';
import { SEARCH_ALBUMS_SQL, SEARCH_ARTISTS_SQL, SEARCH_SONGS_SQL } from './utils/contants';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(ArtistsModel) private artistModel: typeof ArtistsModel,
    @InjectModel(AlbumsModel) private albumModel: typeof AlbumsModel,
    @InjectModel(SongsModel) private songModel: typeof SongsModel,
  ) {}

  async searchArtists(query: string): Promise<ArtistSearchResultData[]> {
    const results = await safeQuery(() =>
      this.artistModel.sequelize!.query<
        Pick<ArtistSearchResultData, 'id' | 'name' | 'album_cover'>
      >(SEARCH_ARTISTS_SQL, {
        type: QueryTypes.SELECT,
        replacements: { query, limit: 11 },
      }),
    );

    return results.map((artist) =>
      artistSearchResultSchema.parse({ ...artist, type: 'artist' }),
    );
  }

  async searchAlbums(query: string): Promise<AlbumSearchResultData[]> {
    const results = await safeQuery(() => 
      this.albumModel.sequelize!.query<
      Pick<AlbumSearchResultData, "id" |"name" | "album_cover" | "artists" | "type">
    >(SEARCH_ALBUMS_SQL, {
      type: QueryTypes.SELECT,
      replacements: { query, limit: 11 },
    })
    );

    return results.map((album) => albumSearchResultSchema.parse({...album, type: "album"}))
  }

  async seachSongs(query: string): Promise<SongSearchResultData[]> {
    const results = await safeQuery(() => 
      this.songModel.sequelize!.query<
      Pick<SongSearchResultData, "id" | "name" | "album" | "url_preview" | 
        "album_cover" | "artists" | "type">
    >(SEARCH_SONGS_SQL, {
      type: QueryTypes.SELECT,
      replacements: { query, limit: 11 },
    })
    );
    
    return results.map((song) => songSearchResultSchema.parse({ ...song, type: "song" }));
  }

  async multipleSearch(query: string): Promise<multipleSearchResults> {
    const [exactArtist, ...artistResults] = await this.searchArtists(query);
    const [exactAlbum, ...albumResults] = await this.searchAlbums(query);
    const [exactSong, ...songResults] = await this.seachSongs(query);

    return multipleSearchResultsSchema.parse({
      exactArtist,
      exactAlbum,
      exactSong,
      artistResults,
      albumResults,
      songResults,
    });
  }
}
