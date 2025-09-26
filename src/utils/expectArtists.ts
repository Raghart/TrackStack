import { ArtistResponse } from 'src/types/artistAttributes';
import { TESTING_IMG } from '../../test/constants/constants';

export const expectArtistData = (
  artistsList: string[],
  artist: ArtistResponse,
) => {
  expect(artistsList).toContain(artist.name);
  expect(artist.album_cover).toBe(TESTING_IMG);
};
