import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import {
  albumSearchResults,
  artistSearchResults,
  multipleSearchResults,
  searchResultType,
  songSearchResults,
} from '@/types/searchTypes';
import { parseAlbumSearchData, parseArtistSearchData, parseSongSearchData } from '@/types/parses';
import { normalizeText } from '@/search/utils/normalizeText';
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
    // Need to refactor the DB search_artists to make it always return X number of limits
    // to make sure it works with the current multipleSearch schema.
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

  sortResults<searchType extends searchResultType>(
    query: string,
    results: searchType[],
  ): searchType[] {
    const norQuery = normalizeText(query);
    return [...results].sort((a, b) => {
      const aName = normalizeText(a.name);
      const bName = normalizeText(b.name);

      const aMatch = aName === norQuery;
      const bMatch = bName === norQuery;
      const aIncludes = aName.includes(norQuery);
      const bIncludes = bName.includes(norQuery);

      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      if (aIncludes && !bIncludes) return -1;
      if (!aIncludes && bIncludes) return 1;
      return 0;
    });
  }

  async multipleSearch(query: string): Promise<multipleSearchResults> {
    const artistSearchResults = await this.searchArtists(query);
    const [exactArtist, ...artistResults] =
      this.sortResults<artistSearchResults>(query, artistSearchResults);

    const albumSearchResults = await this.searchAlbums(query);
    const [exactAlbum, ...albumResults] = this.sortResults<albumSearchResults>(
      query,
      albumSearchResults,
    );

    const songSearchResults = await this.seachSongs(query);
    const [exactSong, ...songResults] = this.sortResults<songSearchResults>(
      query,
      songSearchResults,
    );

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
