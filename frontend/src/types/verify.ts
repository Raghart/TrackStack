import { genreList } from "@/components/Utils/genreIconList";
import { ValidDetail } from "./utilTypes";

export const isValidDetail = (text: unknown) : text is ValidDetail => {
    return typeof text === "string" && ["album","artist","genre"].includes(text);
};

export const isValidGenre = (text: unknown) : text is string => {
    return typeof text === "string" && 
        genreList.some(genre => genre.name.toLowerCase() === text.toLowerCase());
};