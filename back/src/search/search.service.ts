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
  songSearchResults,
} from 'src/types/searchTypes';
import { Client } from 'elasticsearch';
import { sortResults } from './utils/sortResults';
import { normalizeText } from 'src/types/normalizeText';

@Injectable()
export class SearchService {
  constructor(@Inject('BonsaiClient') private readonly esClient: Client) {}

  async ping(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.esClient.ping({}, (err) => {
        if (err) {
          const message =
            err instanceof Error ? err.message : 'Unknow database error';
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

  async multipleSearch(query: string): Promise<multipleSearchResults> {
    try {
      const norQuery = normalizeText(query);
      const artistSearchResults = (
        await this.esClient.search<SearchResponse<artistSearchResults>>({
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
        })
      ).hits.hits.map((artist) => parseArtistSearchData(artist._source));

      const [exactArtist, ...artistResults] = sortResults<artistSearchResults>(
        norQuery,
        artistSearchResults,
      );

      const albumSearchResults = (
        await this.esClient.search<SearchResponse<albumSearchResults>>({
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
        })
      ).hits.hits.map((album) => parseAlbumSearchData(album._source));

      const [exactAlbum, ...albumResults] = sortResults<albumSearchResults>(
        norQuery,
        albumSearchResults,
      );

      const songSearchResults = (
        await this.esClient.search<SearchResponse<songSearchResults>>({
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
        })
      ).hits.hits.map((song) => parseSongSearchData(song._source));

      const [exactSong, ...songResults] = sortResults<songSearchResults>(
        norQuery,
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknow database error';
      throw new ServiceUnavailableException(
        'ElasticSearch is not responding: ' + message,
      );
    }
  }
}
