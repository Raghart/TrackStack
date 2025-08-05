import { highlightType, ValidDetail } from "@/types/utilTypes";

const getHightlightDetails = (type: ValidDetail, detail: string): highlightType => {
    switch (type) {
        case "album":
            return {
                title: `Album: ${detail}`,
                hightlight: detail
            }
        case "artist":
            return {
                title: `Artist: ${detail}`,
                hightlight: detail
            }
        default:
            throw new Error(`Unsoported type: ${type}`)
    };
};

export default getHightlightDetails;