import { SearchResponse } from '@elastic/elasticsearch/api/types';
import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  parseAlbumSearchData,
  parseArtistSearchData,
  parseSongSearchData,
} from 'src/types/parses';
import {
  albumSearchResults,
  artistSearchResults,
  multipleSearchResults,
  searchResultType,
  songSearchResults,
} from 'src/types/searchTypes';
import { Client } from 'elasticsearch';
import { normalizeText } from 'src/search/utils/normalizeText';
import { safeSearch } from 'src/utils/safeSearch';

@Injectable()
export class SearchService {
  constructor(@Inject('BonsaiClient') private readonly esClient: Client) {}

  async ping(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.esClient.ping({}, (err) => {
        if (err) {
          const message = (err as Error).message;
          reject(
            new ServiceUnavailableException(
              'ElasticSearch is not responding: ' + message,
            ),
          );
        } else {
          resolve(true);
        }
      });
    });
  }

  async searchArtists(query: string): Promise<artistSearchResults[]> {
    const results = await safeSearch(() =>
      this.esClient.search<SearchResponse<artistSearchResults>>({
        index: 'artists',
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

    return results.hits.hits.map((artist) =>
      parseArtistSearchData(artist._source),
    );
  }

  async searchAlbums(query: string): Promise<albumSearchResults[]> {
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
    return results.hits.hits.map((album) =>
      parseAlbumSearchData(album._source),
    );
  }

  async seachSongs(query: string): Promise<songSearchResults[]> {
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
    return results.hits.hits.map((song) => parseSongSearchData(song._source));
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
