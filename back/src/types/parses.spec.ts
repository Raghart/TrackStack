import {
  parseAlbumSearchData,
  parseAlbumSong,
  parseArtistSearchData,
  parseArtistSongs,
  parseFloatNum,
  parseFullSongResponse,
  parseSongRecommendations,
  parseNumberArray,
  parseSongGenres,
  parseSongResponse,
  parseSongSearchData,
  parseString,
  parseStringArray,
} from './parses';
import { albumSongs } from '../../test/data/albumsModule/AlbumData';
import { songGenresData } from '../../test/data/songGenresModule/songGenresData';
import {
  songFullRawResponse,
  songRecRawResponse,
  songTestData,
} from '../../test/data/songsModule/serSongData';
import {
  searchAlbums,
  searchArtists,
  searchSongs,
} from '../../test/data/searchModule/searchData';
import { expectParse, expectParseError } from 'src/utils/expectParse';
import { artistSongsData } from '../../test/data/artistsModule/artistData';

describe('parses return the data with the expected type', () => {
  describe('parseString', () => {
    it('parseString returns an error when the parse is not a string', () => {
      const errArray = [123456, ['hello'], null, undefined];
      errArray.forEach((data) =>
        expectParseError(
          parseString,
          data,
          `The data recieved is not a string: ${String(data)}`,
        ),
      );
    });

    it('parseString returns a typeGuarded string if arg is a string', () => {
      const str = ['hello', '     how are you?       '];
      str.forEach((data) => expectParse(parseString, data));
    });
  });

  describe('parseStringArray', () => {
    it('parseStringArray returns an error when the parse is not an array of string', () => {
      const errArray = [123456, [123456], null, undefined];
      errArray.forEach((err) =>
        expectParseError(
          parseStringArray,
          err,
          'The data recieved is not an array of strings.',
        ),
      );
    });

    it('parseStringArray returns a typeGuarded array of strings if arg is an array string', () => {
      const strArray = [['hello'], ['     how are you?       ', 'helloooo']];
      strArray.forEach((strArray) => expectParse(parseStringArray, strArray));
    });
  });

  describe('parseNumberArray', () => {
    it('parseNumberArray returns an error when the parse is not an array of numbers', () => {
      const errArray = [123456, ['testing'], null, undefined];
      errArray.forEach((err) =>
        expectParseError(
          parseNumberArray,
          err,
          `Error: the data is neither an array or a number: "${String(err)}"`,
        ),
      );
    });

    it('parseNumberArray returns a typeGuarded array of numbers if arg is an array of numbers', () => {
      const numArray = [[123456], [5984352, 456789]];
      numArray.forEach((num) => expectParse(parseNumberArray, num));
    });
  });

  describe('parseFloatNum', () => {
    it('parseFloatNum returns a BadRequestException when the arg is null or undefined', () => {
      const errArray = [
        null,
        undefined,
        ['testing'],
        [123456],
        'papa',
        '18Jenkins18',
      ];
      errArray.forEach((err) =>
        expectParseError(
          parseFloatNum,
          err,
          `The data received is not a valid number or a string of numbers: ${String(err)}`,
        ),
      );
    });

    it('parseFloatNum returns a typeGuarded number if value is a number', () => {
      const NUMBER = 123;
      expect(parseFloatNum(NUMBER)).toBe(NUMBER);
    });

    it('parseFloatNum returns the number when the arg is a valid text number or a number', () => {
      expect(parseFloatNum('  123456  ')).toBe(123456);
      expect(parseFloatNum('456')).toBe(456);
    });
  });

  describe('parseAlbumSong', () => {
    it('parseAlbumSong returns an error when the parse is not an array of numbers', () => {
      const errArray = [123456, ['testing'], null, undefined];
      errArray.forEach((err) =>
        expectParseError(
          parseAlbumSong,
          err,
          'There was an error trying to find the songs of this album.',
        ),
      );
    });

    it('parseAlbumSong returns a typeGuarded array of songs if arg is an array of songs of the album', () => {
      expect(parseAlbumSong(albumSongs)).toBe(albumSongs);
    });
  });

  describe('parseArtistSongs', () => {
    it('parseArtistSongs returns an error when the parse is not an array of numbers', () => {
      const errArray = [123456, ['testing'], null, undefined];
      errArray.forEach((err) =>
        expectParseError(
          parseArtistSongs,
          err,
          "The data doesn't have the correct song format.",
        ),
      );
    });

    it('parseArtistSongs ensure that the songs match the correct artist songs object structure', () => {
      expect(parseArtistSongs(artistSongsData)).toBe(artistSongsData);
    });
  });

  describe('parseSongGenres', () => {
    it('parseSongGenres returns an error when the parse is not an array of numbers', () => {
      const errArray = [123456, ['testing'], null, undefined];
      errArray.forEach((err) =>
        expectParseError(
          parseSongGenres,
          err,
          'The data recieved is not in the correct Song-Genre Format.',
        ),
      );
    });

    it('parseSongGenres ensure that the songs match the correct genreSongs object structure', () => {
      songGenresData.forEach((song) =>
        expect(parseSongGenres(song)).toBe(song),
      );
    });
  });

  describe('parseSongResponse', () => {
    it('parseSongResponse returns an error when the parse is not an array of numbers', () => {
      const errArray = [123456, ['testing'], null, undefined];
      errArray.forEach((err) =>
        expectParseError(
          parseSongResponse,
          err,
          "The data recieved doesn't match the required song response structure.",
        ),
      );
    });

    it('parseSongResponse ensure that the songs match the correct songResponse object structure', () => {
      songTestData.forEach((song) =>
        expect(parseSongResponse(song)).toBe(song),
      );
    });
  });

  describe('parseFullSongResponse', () => {
    it('parseFullSongResponse returns an error when the parse is not an array of numbers', () => {
      const errArray = [123456, ['testing'], null, undefined];
      errArray.forEach((err) =>
        expectParseError(
          parseFullSongResponse,
          err,
          "The data recieved doesn't match the required full song response structure.",
        ),
      );
    });

    it('parseFullSongResponse ensure that the songs match the correct full songResponse object structure', () => {
      expect(parseFullSongResponse(songFullRawResponse)).toBe(
        songFullRawResponse,
      );
    });
  });

  describe('parseSongRecommendations', () => {
    it('parseSongRecommendations returns an error when the parse is not an array of numbers', () => {
      const errArray = [123456, ['testing'], null, undefined];
      errArray.forEach((err) =>
        expectParseError(
          parseSongRecommendations,
          err,
          "The data recieved didn't match with the expected song recommendation format",
        ),
      );
    });

    it('parseIASongData ensure that the songs match the correct object structure', () => {
      songRecRawResponse.forEach((song) =>
        expect(parseSongRecommendations(song)).toBe(song),
      );
    });
  });

  describe('parseArtistSearchData', () => {
    it('parseArtistSearchData returns an error when the parse is not an array of numbers', () => {
      const errArray = [123456, ['testing'], null, undefined];
      errArray.forEach((err) =>
        expectParseError(
          parseArtistSearchData,
          err,
          `The data received didn't have the correct artistSearch format: "${String(err)}".`,
        ),
      );
    });

    it('parseArtistSearchData ensure that the data match the correct object structure', () => {
      searchArtists.forEach((artist) =>
        expect(parseArtistSearchData(artist)).toBe(artist),
      );
    });
  });

  describe('parseAlbumSearchData', () => {
    it('parseAlbumSearchData returns an error when the parse is not an array of numbers', () => {
      const errArray = [123456, ['testing'], null, undefined];
      errArray.forEach((err) =>
        expectParseError(
          parseAlbumSearchData,
          err,
          `The data recieved is not in a valid albumSearch format: "${String(err)}".`,
        ),
      );
    });

    it('parseAlbumSearchData ensure that the data match the correct object structure', () => {
      searchAlbums.forEach((album) =>
        expect(parseAlbumSearchData(album)).toBe(album),
      );
    });
  });

  describe('parseSongSearchData', () => {
    it('parseSongSearchData returns an error when the parse is not an array of numbers', () => {
      const errArray = [123456, ['testing'], null, undefined];
      errArray.forEach((err) =>
        expectParseError(
          parseSongSearchData,
          err,
          `The data recieved is not in a valid songSearch format: "${String(err)}"`,
        ),
      );
    });

    it('parseSongSearchData ensure that the data match the correct object structure', () => {
      searchSongs.forEach((song) =>
        expect(parseSongSearchData(song)).toBe(song),
      );
    });
  });
});
