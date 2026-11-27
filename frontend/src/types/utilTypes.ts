import { IconType } from "react-icons/lib"
import { GenreListFormat } from "./genreTypes";
import { ArtistResponse, SongResponse } from "@trackstack/schemas";

export interface highlightType {
    title: string;
    hightlight: string;
};

export interface GradientData {
    gradientInit: string;
    gradientMid: string;
}

export type ValidDetail = "album" | "artist";

export interface NavItem {
    name: "Home"  | "Artists" | "Genres" | "Albums";
    iconType: IconType;
    IconColor: string;
    path: "/" | "/artists" | "/genres" | "/albums";
    bg: string;
    hover: string;
};

export type InfiniteScrollItems = SongResponse | ArtistResponse | GenreListFormat;
      