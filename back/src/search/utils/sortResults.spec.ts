import {
  searchAlbums,
  searchArtists,
  searchSongs,
} from '../../../test/data/searchModule/searchData';
import { sortResults } from './sortResults';
import {
  albumSearchResults,
  artistSearchResults,
  songSearchResults,
} from 'src/types/searchTypes';

describe('sortResults', () => {
  it('sortResults sorts correctly if the first item is exactly the query', () => {
    expect(
      sortResults<artistSearchResults>('nirvana', searchArtists)[0].name,
    ).toBe('Nirvana');
    expect(
      sortResults<albumSearchResults>('pablo honey', searchAlbums)[0].name,
    ).toBe('Pablo Honey');
    expect(sortResults<songSearchResults>('creep', searchSongs)[0].name).toBe(
      'Creep',
    );
  });

  it('sortResults sorts correctly the first item even if it has an unique accentuation', () => {
    expect(
      sortResults<artistSearchResults>('mago de oz', searchArtists)[0].name,
    ).toBe('Mägo de Oz');
  });

  it("sortResults sorts correctly even if the query doesn't have the exact name", () => {
    expect(
      sortResults<artistSearchResults>('nirv', searchArtists)[0].name,
    ).toBe('Nirvana');
    expect(
      sortResults<albumSearchResults>('nevermind', searchAlbums)[0].name,
    ).toBe('Nevermind (Remastered)');
    expect(sortResults<songSearchResults>('wonder', searchSongs)[0].name).toBe(
      'Wonderwall',
    );
  });

  it("sortResults leaves the rest of the items as they are if the doesn't match the query", () => {
    expect(
      sortResults<artistSearchResults>('nirvana', searchArtists)[1].name,
    ).not.toBe('Nirvana');
    expect(
      sortResults<albumSearchResults>('nevermind', searchAlbums)[1].name,
    ).not.toBe('Nevermind (Remastered)');
    expect(
      sortResults<songSearchResults>('come', searchSongs)[1].name,
    ).not.toBe('Come as You Are');
  });
});
