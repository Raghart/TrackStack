import { SwitchTagsStyles } from "@/types/modalCssTypes";
import { FaMicrophoneAlt, FaGuitar, FaSmile, FaSadTear, FaMicrophone, FaHeadphones } from "react-icons/fa";

export const SwitchStyles: SwitchTagsStyles = {
    Vocals: {
        tagBg: "pink.400",
        ThumbBg: "pink.200",
        ThumbBackgroundBg: "pink.400",
        ThumbIcon: FaMicrophoneAlt,
        IconColor: "pink.500",
        ThumbBackgroundIcon: FaGuitar,
        BackgroundIconColor: "cyan.500",
        border: "0 0 0 2px var(--chakra-colors-pink-500), 0 0 8px var(--chakra-colors-pink-500)",
    }, 
    Instrumental: {
        tagBg: "cyan.500",
        ThumbBg: "cyan.200",
        ThumbBackgroundBg: "cyan.400",
        ThumbIcon: FaGuitar,
        IconColor: "cyan.500",
        ThumbBackgroundIcon: FaMicrophone,
        BackgroundIconColor: "pink.400",
        border: "0 0 0 2px var(--chakra-colors-cyan-600), 0 0 8px var(--chakra-colors-cyan-600)"
    },
    Happy: {
        tagBg: "purple.400",
        ThumbBg: "purple.200",
        ThumbBackgroundBg: "purple.400",
        ThumbIcon: FaSmile,
        IconColor: "pink.400",
        ThumbBackgroundIcon: FaSadTear,
        BackgroundIconColor: "blue.500",
        border: "0 0 0 2px var(--chakra-colors-purple-500), 0 0 8px var(--chakra-colors-purple-500)"
    }, 
    Sad: {
        tagBg: "blue.500",
        ThumbBg: "blue.500",
        ThumbBackgroundBg: "blue.400",
        ThumbIcon: FaSadTear,
        IconColor: "yellow.500",
        ThumbBackgroundIcon: FaSmile,
        BackgroundIconColor: "yellow.500",
        border: "0 0 0 2px var(--chakra-colors-blue-600), 0 0 8px var(--chakra-colors-blue-600)"
    }, 
    Acoustic: {
        tagBg: "green.500",
        ThumbBg: "green.200",
        ThumbBackgroundBg: "green.500",
        ThumbIcon: FaGuitar,
        IconColor: "green.500",
        ThumbBackgroundIcon: FaHeadphones,
        BackgroundIconColor: "orange.300",
        border: "0 0 0 2px var(--chakra-colors-green-600), 0 0 8px var(--chakra-colors-green-600)"
    },
    Electronic: {
        tagBg: "orange.400",
        ThumbBg: "orange.200",
        ThumbBackgroundBg: "orange.400",
        ThumbIcon: FaHeadphones,
        IconColor: "orange.400",
        ThumbBackgroundIcon: FaGuitar,
        BackgroundIconColor: "green.600",
        border: "0 0 0 2px var(--chakra-colors-orange-500), 0 0 8px var(--chakra-colors-orange-500)"
    },
};