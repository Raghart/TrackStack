import { GradientData, ValidDetail } from "@/types/utilTypes";

export const getGradientDetails = (type: ValidDetail) : GradientData => {
    switch (type) {
        case "album": return {
            gradientInit: "yellow.500",
            gradientMid: "orange.500"
        }
        case "artist": return {
            gradientInit: "orange.500",
            gradientMid: "yellow.500",
        }
        default:
            throw new Error("Invalid data detail type")
    }
};