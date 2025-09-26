export type GenreInclude = {
  where: {
    genre: {
      [symbol: symbol]: string;
    };
  };
};

export type FindAllGenreSongsParams = {
  offset: number;
  limit: number;
  include: GenreInclude[];
};

export type FindAllArtistsParams = {
  offset: number;
  limit: number;
};

export type GetLandSongsParams = {
  limit: number;
};

export type FindNameParams = {
  where: {
    name: Record<symbol, string>;
  };
};

export interface artistDataType {
  id: number;
  name: string;
  songs: {
    name: string;
    album: {
      url_image: string;
    };
  }[];
}
