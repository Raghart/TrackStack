import {
  isAlbumSearchData,
  isAlbumSong,
  isArtistSearchData,
  isArtistSongs,
  isFullSongResponse,
  isIASongData,
  isNumber,
  isNumberArray,
  isSongGenres,
  isSongResponse,
  isSongSearchData,
  isString,
  isStringArray,
} from './verify';
import { albumSongs } from '../../test/data/albumsModule/AlbumData';
import { songGenresData } from '../../test/data/songGenresModule/songGenresData';
import {
  songFullRawResponse,
  songIARawResponse,
  songTestData,
} from '../../test/data/songsModule/serSongData';
import {
  searchAlbums,
  searchArtists,
  searchSongs,
} from '../../test/data/searchModule/searchData';
import { WRONG_OBJ } from '../../test/constants/constants';
import { artistSongsData } from '../../test/data/artistsModule/artistData';

describe('Verify value Types', () => {
  describe('isString', () => {
    it('isString returns false when text is not a string', () => {
      const NOTSTRINGS = [123, undefined, null, {}, ['123'], '            '];
      NOTSTRINGS.forEach((err) => expect(isString(err)).toBe(false));
    });

    it('isString returns true when text is a string', () => {
      const strings = ['hello', '   how are you?    '];
      strings.forEach((str) => expect(isString(str)).toBe(true));
    });
  });

  describe('isNumber', () => {
    it('isNumber returns false when value is not a number', () => {
      const NOTNUMBERS = ['hello', undefined, null, {}, ['123'], '           '];
      NOTNUMBERS.forEach((err) => expect(isNumber(err)).toBe(false));
    });

    it('isNumber returns true when text is a string', () => {
      const numbers = [123, 456];
      numbers.forEach((num) => expect(isNumber(num)).toBeTruthy());
    });

    it('isNumber returns false when value is not a valid numeric string', () => {
      const NOTVALID_STRS = [
        'wekeke18',
        '18Jenkins18',
        '48Hacking35',
        null,
        undefined,
      ];
      NOTVALID_STRS.forEach((str) => expect(isNumber(str)).toBe(false));
    });

    it('isNumber returns true when value is a valid numeric string', () => {
      const VALID_STRS = ['123456', '    456897      '];
      VALID_STRS.forEach((str) => expect(isNumber(str)).toBe(true));
    });
  });

  describe('isStringArray', () => {
    it('isStringArray returns false when value is not an array of strings', () => {
      const NON_STRING_ARRAY = [
        'hello',
        undefined,
        null,
        {},
        [123],
        '           ',
      ];
      NON_STRING_ARRAY.forEach((err) => expect(isStringArray(err)).toBe(false));
    });

    it('isStringArray returns true when text is a string', () => {
      const stringArray = [['123', 'hello']];
      stringArray.forEach((arr) => expect(isStringArray(arr)).toBe(true));
    });
  });

  describe('isNumberArray', () => {
    it('isNumberArray returns false when value is not an array of strings', () => {
      const NON_NUMBER_ARR = [
        'hello',
        undefined,
        null,
        {},
        ['heeeey'],
        '           ',
      ];
      NON_NUMBER_ARR.forEach((err) => expect(isNumberArray(err)).toBe(false));
    });

    it('isNumberArray returns true when text is a string', () => {
      expect(isNumberArray([123])).toBe(true);
      expect(isNumberArray([5167, 354])).toBe(true);
    });
  });

  describe('isAlbumSong', () => {
    it('isAlbumSong returns early false when value is null or undefined', () => {
      expect(isAlbumSong(null)).toBe(false);
      expect(isAlbumSong(undefined)).toBe(false);
    });

    it("isAlbumSong returns false when the object doesn't have the expected props", () => {
      expect(isAlbumSong(WRONG_OBJ)).toBe(false);
    });

    it('isAlbumSong returns true when it has the correct props', () => {
      expect(isAlbumSong(albumSongs)).toBe(true);
    });
  });

  describe('isArtistSongs', () => {
    it('isArtistSongs returns early false when value is null or undefined', () => {
      expect(isArtistSongs(null)).toBe(false);
      expect(isArtistSongs(undefined)).toBe(false);
    });

    it("isArtistSongs returns false when the object doesn't have the expected props", () => {
      expect(isArtistSongs(WRONG_OBJ)).toBe(false);
    });

    it('isArtistSongs returns true when it has the correct props', () => {
      expect(isArtistSongs(artistSongsData)).toBe(true);
    });
  });

  describe('isSongGenres', () => {
    it('isSongGenres returns early false when value is null or undefined', () => {
      expect(isSongGenres(null)).toBe(false);
      expect(isSongGenres(undefined)).toBe(false);
    });

    it("isSongGenres returns false when the object doesn't have the expected props", () => {
      expect(isSongGenres(WRONG_OBJ)).toBe(false);
    });

    it('isSongGenres returns true when it has the correct props', () => {
      expect(isSongGenres(songGenresData[0])).toBe(true);
    });
  });

  describe('isSongResponse', () => {
    it('isSongResponse returns early false when value is null or undefined', () => {
      expect(isSongResponse(null)).toBe(false);
      expect(isSongResponse(undefined)).toBe(false);
    });

    it("isSongResponse returns false when the object doesn't have the expected props", () => {
      expect(isSongResponse(WRONG_OBJ)).toBe(false);
    });

    it('isSongResponse returns true when it has the correct props', () => {
      expect(isSongResponse(songTestData[0])).toBe(true);
    });
  });

  describe('isFullSongResponse', () => {
    it('isFullSongResponse returns early false when value is null or undefined', () => {
      expect(isFullSongResponse(null)).toBe(false);
      expect(isFullSongResponse(undefined)).toBe(false);
    });

    it("isFullSongResponse returns false when the object doesn't have the expected props", () => {
      expect(isFullSongResponse(WRONG_OBJ)).toBe(false);
    });

    it('isFullSongResponse returns true when it has the correct props', () => {
      expect(isFullSongResponse(songFullRawResponse)).toBe(true);
    });
  });

  describe('isIASongData', () => {
    it('isIASongData returns early false when value is null or undefined', () => {
      expect(isIASongData(null)).toBe(false);
      expect(isIASongData(undefined)).toBe(false);
    });

    it("isIASongData returns false when the object doesn't have the expected props", () => {
      expect(isIASongData(WRONG_OBJ)).toBe(false);
    });

    it('isIASongData returns true when it has the correct props', () => {
      expect(isIASongData(songIARawResponse[0])).toBe(true);
    });
  });

  describe('isArtistSearchData', () => {
    it('isArtistSearchData returns early false when value is null or undefined', () => {
      expect(isArtistSearchData(null)).toBe(false);
      expect(isArtistSearchData(undefined)).toBe(false);
    });

    it("isArtistSearchData returns false when the object doesn't have the expected props", () => {
      expect(isArtistSearchData(WRONG_OBJ)).toBe(false);
    });

    it('isArtistSearchData returns true when it has the correct props', () => {
      expect(isArtistSearchData(searchArtists[0])).toBe(true);
    });
  });

  describe('isAlbumSearchData', () => {
    it('isAlbumSearchData returns early false when value is null or undefined', () => {
      expect(isAlbumSearchData(null)).toBe(false);
      expect(isAlbumSearchData(undefined)).toBe(false);
    });

    it("isAlbumSearchData returns false when the object doesn't have the expected props", () => {
      expect(isAlbumSearchData(WRONG_OBJ)).toBe(false);
    });

    it('isAlbumSearchData returns true when it has the correct props', () => {
      expect(isAlbumSearchData(searchAlbums[0])).toBe(true);
    });
  });

  describe('isSongSearchData', () => {
    it('isSongSearchData returns early false when value is null or undefined', () => {
      expect(isSongSearchData(null)).toBe(false);
      expect(isSongSearchData(undefined)).toBe(false);
    });

    it("isSongSearchData returns false when the object doesn't have the expected props", () => {
      expect(isSongSearchData(WRONG_OBJ)).toBe(false);
    });

    it('isSongSearchData returns true when it has the correct props', () => {
      expect(isSongSearchData(searchSongs[0])).toBe(true);
    });
  });
});
