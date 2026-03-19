import { SliderTagsProps } from "@/types/modalCssTypes";
import { SliderLabels } from "@/types/RecDataTypes";

export const MapSliderStyles = new Map<SliderLabels, SliderTagsProps> ([
    ["Relaxed", {
        bg: "green.600",
        border: "0 0 0 2px var(--chakra-colors-cyan-600), 0 0 8px var(--chakra-colors-cyan-600)",
    }],
    ["Active", {
        bg: "yellow.600",
        border: "0 0 0 2px var(--chakra-colors-orange-500), 0 0 8px var(--chakra-colors-orange-500)"
    }],
    ["Intense", {
        bg: "red.600",
        border: "0 0 0 2px var(--chakra-colors-orange-600), 0 0 8px var(--chakra-colors-orange-600)",
    }],
    ["Calm", {
        bg: "blue.500",
        border: "0 0 0 2px var(--chakra-colors-blue-600), 0 0 8px var(--chakra-colors-blue-600)"
    }],
    ["Rhythmic", {
        bg: "teal.500",
        border: "0 0 0 2px var(--chakra-colors-green-600), 0 0 8px var(--chakra-colors-green-600)"
    }],
    ["70 BPM", {
        bg: "orange.500",
        border: "0 0 0 2px var(--chakra-colors-yellow-600), 0 0 8px var(--chakra-colors-yellow-600)"
    }],
    ["120 BPM", {
        bg: "green.500",
        border: "0 0 0 2px var(--chakra-colors-cyan-600), 0 0 8px var(--chakra-colors-cyan-600)"
    }],
    ["230 BPM", {
        bg: "purple.500",
        border: "0 0 0 2px var(--chakra-colors-purple-600), 0 0 8px var(--chakra-colors-purple-600)"
    }],
    ["😌", {
        bg: "cyan.600",
        border: "0 0 0 2px var(--chakra-colors-blue-600), 0 0 8px var(--chakra-colors-blue-600)"
    }],
    ["🙂", {
        bg: "orange.600",
        border: "0 0 0 2px var(--chakra-colors-yellow-600), 0 0 8px var(--chakra-colors-yellow-600)"
    }],
    ["😝", {
        bg: "pink.500",
        border: "0 0 0 2px var(--chakra-colors-orange-500), 0 0 8px var(--chakra-colors-orange-500)"
    }],
]);