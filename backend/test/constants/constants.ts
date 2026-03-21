export const TESTING_URL =
  'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86';
export const TESTING_IMG =
  'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480';
export const NOTFOUND_ERROR = "The artist: 'Benito' doesn't exist in the DB!";
export const pingError = 'ElasticSearch is not responding: Ping failed';
export const searchError =
  "ElasticSearch is not responding: Timeout Error: It's taking too long";
export const NOGENRE_ERROR = "The genre: 'noGenre' doesn't exist in the DB!";
export const WRONG_OBJ = { id: 123, name: 'papelon', url_image: '', songs: [] };

export const USER_VECTOR: [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
] = [
  0.049279034, 0.508, 0.979, 0.90909094, 0.87538105, 0, 0.0847, 8.7e-5,
  0.000643, 0.0641, 0.704, 0.5777852, 0.8,
];
