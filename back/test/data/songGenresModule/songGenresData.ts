import { TESTING_IMG, TESTING_URL } from '../../../test/constants/constants';

export const songGenresData: any[] = [
  {
    id: 736298,
    song_id: 641705,
    genre_id: 1624,
    genre: { id: 1624, genre: 'Rock' },
    song: {
      id: 641705,
      name: "I'm A Mover",
      spotify_id: '09Sweb86ucflf42EJNELf2',
      url_preview: TESTING_URL,
      duration: 2.94,
      year: 2010,
      album_id: 271488,
      artists: [{ name: 'Iron Maiden' }],
      album: { url_image: TESTING_IMG },
    },
  },
  {
    id: 718402,
    song_id: 635687,
    genre_id: 1624,
    genre: { id: 1624, genre: 'Rock' },
    song: {
      id: 635687,
      name: 'Smoking Umbrellas',
      spotify_id: '11IYFUPlQPPAQjxfl2HncN',
      url_preview: TESTING_URL,
      duration: 3.98,
      year: 1996,
      album_id: 269049,
      artists: [{ name: 'Failure Band' }],
      album: { url_image: TESTING_IMG },
    },
  },
  {
    id: 566593,
    song_id: 598474,
    genre_id: 1624,
    genre: { id: 1624, genre: 'Rock' },
    song: {
      id: 598474,
      name: 'Bones',
      spotify_id: '15yTaT0c9Y9aPiKEwHeftf',
      url_preview: TESTING_URL,
      duration: 3.78,
      year: 2010,
      album_id: 254380,
      artists: [{ name: 'Imagine Dragons' }],
      album: { url_image: TESTING_IMG },
    },
  },
];

export const songGenresResData = [
  {
    id: 1,
    name: "I'm A Mover",
    artists: ['Iron Maiden'],
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
  },
  {
    id: 2,
    name: 'Smoking Umbrellas',
    artists: ['Failure Band'],
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
  },
  {
    id: 3,
    name: 'Bones',
    artists: ['Imagine Dragons'],
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
  },
];
