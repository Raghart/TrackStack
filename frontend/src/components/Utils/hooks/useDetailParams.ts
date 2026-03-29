import { ValidDetail } from "@/types/utilTypes";

const useDetailParams = (type: ValidDetail, album?: string, artist?: string) => {
    if (type === "album" && album) return album;
    if (type === "artist" && artist) return artist;
    return "";
}

export default useDetailParams;