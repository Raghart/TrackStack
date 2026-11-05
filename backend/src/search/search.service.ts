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
import { parseArtistSearchData } from '@/types/parses';
import { normalizeText } from '@/search/utils/normalizeText';
import safeQuery from '@/utils/safeQuery';
import { ArtistsModel } from '../../models/artists/artists.model';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(ArtistsModel) private artistModel: typeof ArtistsModel,
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
    const albumSearchResults: albumSearchResults[] = [];
    /*
    const results = await safeSearch(() =>
      this.esClient.search<SearchResponse<albumSearchResults>>({
        index: 'albums',
        size: 11,
        body: {
          query: {
            multi_match: {
              query,
              type: 'best_fields',
              fuzziness: 'AUTO',
              fields: ['name^3', 'name.edge^2', 'name.ngram'],
            },
          },
        },
      }),
    );
    */
    return albumSearchResults;
  }

  async seachSongs(query: string): Promise<songSearchResults[]> {
    const songSearches: songSearchResults[] = [];
    /*
    const results = await safeSearch(() =>
      this.esClient.search<SearchResponse<songSearchResults>>({
        index: 'songs',
        body: {
          query: {
            multi_match: {
              query,
              type: 'best_fields',
              fuzziness: 'AUTO',
              fields: ['name^3', 'name.edge^2', 'name.ngram'],
            },
          },
        },
      }),
    );
    */
    return songSearches;
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
