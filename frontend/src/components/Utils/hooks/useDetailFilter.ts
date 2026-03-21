import { useParams } from "react-router-dom";
import useDetailParams from "./useDetailParams";
import { ValidDetail } from "@/types/utilTypes";
import getHightlightDetails from "@/dynamicCSS/getHighlightDetails";

const useDetailFilter = (type: ValidDetail) => {
    const { album, artist } = useParams();
    const filterValue = album ?? artist ?? null;
    const detailKey = useDetailParams(type, album, artist);
    const hightlightDetails = getHightlightDetails(type, detailKey);

    return { filterValue, hightlightDetails }
};

export default useDetailFilter;