import { genreList } from "@/components/Utils/genreIconList";
import { ValidDetail } from "./utilTypes";

export const isString = (text: unknown): text is string => {
    return typeof text === "string" || text instanceof String;
};

export const isNumber = (number: unknown): number is number => {
    return typeof number === "string" && !isNaN(parseInt(number));
};

export const isValidDetail = (text: unknown) : text is ValidDetail => {
    if (isString(text) && (text === "album" || text === "artist" || text === "genre")) {
        return true;
    };
    return false;
};

export const isValidGenre = (text: string) : boolean => {
    return genreList.some(genre => genre.name.toLowerCase() === text.toLowerCase());
};