import { IconType } from "react-icons/lib"
import { SongResponse } from "./songTypes";
import { ArtistResponse } from "./artistTypes";
import { GenreListFormat } from "./genreTypes";

export interface highlightType {
    title: string;
    hightlight: string;
};

export type ValidDetail = "album" | "artist";

type NavNameOptions = "Home"  | "Artists" | "Genres" | "Albums";
type NavPath = "/" | "/artists" | "/genres" | "/albums";

export interface NavItem {
    name: NavNameOptions;
    iconType: IconType;
    IconColor: string;
    path: NavPath;
    bg: string;
    hover: string;
};

export type InfiniteScrollItems = SongResponse | ArtistResponse | GenreListFormat;
      