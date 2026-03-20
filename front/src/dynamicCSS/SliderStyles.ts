import { BsFire } from "react-icons/bs";
import { BiSolidHappyBeaming } from "react-icons/bi";
import { RiEmotionHappyFill, RiFlashlightFill } from "react-icons/ri";
import { FaWind, FaLeaf } from "react-icons/fa";
import { FaHeartCircleBolt, FaCloud } from "react-icons/fa6";
import { AiFillThunderbolt } from "react-icons/ai";
import { GiGuitarHead, GiHeartBeats, GiLotus } from "react-icons/gi";
import { SliderStylesOptions, SliderStylesProps, SliderType } from "@/types/modalCssTypes";

export const MapSliderStyles = new Map<SliderType, SliderStylesProps> ([
    ["Energy", {
        threshold: [0.30, 0.70],
        SliderBg: ["green.500", "yellow.600", "red.600"],
        Icon: [FaCloud, BsFire, AiFillThunderbolt],
        IconColor: ["green.400", "red.500", "yellow.500"],
        IconBorder: ["cyan.600", "orange.600", "yellow.600"],
        shadow: ["0 0 8px var(--chakra-colors-green-500)", "0 0 8px var(--chakra-colors-yellow-600)",
          "0 0 8px var(--chakra-colors-red-600)" ],
    }],
    ["Danceability", {
        threshold: [0.30, 0.70],
        SliderBg: ["blue.500", "teal.500", "red.600"],
        Icon: [GiLotus, GiHeartBeats, RiFlashlightFill],
        IconColor: ["blue.400", "green.300", "yellow.500"],
        IconBorder: ["cyan.600", "cyan.500", "yellow.600"],
        shadow: ["0 0 8px var(--chakra-colors-blue-500)", "0 0 8px var(--chakra-colors-teal-500)",
          "0 0 8px var(--chakra-colors-red-600)" ]
    }],
    ["Tempo", {
        threshold: [75, 160],
        SliderBg: ["yellow.600", "green.500", "purple.500"],
        Icon: [FaWind, GiGuitarHead, FaHeartCircleBolt],
        IconColor: ["orange.300", "green.400", "purple.400"],
        IconBorder: ["orange.500", "teal.500", "purple.600"],
        shadow: ["0 0 8px var(--chakra-colors-yellow-600)", "0 0 8px var(--chakra-colors-green-500)",
            "0 0 8px var(--chakra-colors-purple-500)"]
    }],
    ["Sentiment", {
        threshold: [0.30, 0.70],
        SliderBg: ["cyan.600", "orange.600", "pink.600"],
        Icon: [FaLeaf, RiEmotionHappyFill, BiSolidHappyBeaming],
        IconColor: ["green.500", "yellow.500", "pink.300"],
        IconBorder: ["cyan.500", "orange.600", "red.500"],
        shadow: ["0 0 8px var(--chakra-colors-cyan-600)", "0 0 8px var(--chakra-colors-orange-600)", 
            "0 0 8px var(--chakra-colors-pink-600)" ]
    }]
]);

export const defaultSliderStyle = {
    threshold: [0.30, 0.70],
    SliderBg: ["green.500", "yellow.600", "red.600"],
    Icon: [FaCloud, BsFire, AiFillThunderbolt],
    IconColor: ["green.400", "red.500", "yellow.500"],
    IconBorder: ["cyan.600", "orange.600", "yellow.600"],
    shadow: ["0 0 8px var(--chakra-colors-green-500)", "0 0 8px var(--chakra-colors-yellow-600)",
        "0 0 8px var(--chakra-colors-red-600)" ]
}

export const SliderStyles: SliderStylesOptions = {
    Energy: {
        threshold: [0.30, 0.70],
        SliderBg: ["green.500", "yellow.600", "red.600"],
        Icon: [FaCloud, BsFire, AiFillThunderbolt],
        IconColor: ["green.400", "red.500", "yellow.500"],
        IconBorder: ["cyan.600", "orange.600", "yellow.600"],
        shadow: ["0 0 8px var(--chakra-colors-green-500)", "0 0 8px var(--chakra-colors-yellow-600)",
          "0 0 8px var(--chakra-colors-red-600)" ]
    },
    Danceability: {
        threshold: [0.30, 0.70],
        SliderBg: ["blue.500", "teal.500", "red.600"],
        Icon: [GiLotus, GiHeartBeats, RiFlashlightFill],
        IconColor: ["blue.400", "green.300", "yellow.500"],
        IconBorder: ["cyan.600", "cyan.500", "yellow.600"],
        shadow: ["0 0 8px var(--chakra-colors-blue-500)", "0 0 8px var(--chakra-colors-teal-500)",
          "0 0 8px var(--chakra-colors-red-600)" ]
    },
    Tempo: {
        threshold: [75, 160],
        SliderBg: ["yellow.600", "green.500", "purple.500"],
        Icon: [FaWind, GiGuitarHead, FaHeartCircleBolt],
        IconColor: ["orange.300", "green.400", "purple.400"],
        IconBorder: ["orange.500", "teal.500", "purple.600"],
        shadow: ["0 0 8px var(--chakra-colors-yellow-600)", "0 0 8px var(--chakra-colors-green-500)",
            "0 0 8px var(--chakra-colors-purple-500)"]
    },
    Sentiment: {
        threshold: [0.30, 0.70],
        SliderBg: ["cyan.600", "orange.600", "pink.600"],
        Icon: [FaLeaf, RiEmotionHappyFill, BiSolidHappyBeaming],
        IconColor: ["green.500", "yellow.500", "pink.300"],
        IconBorder: ["cyan.500", "orange.600", "red.500"],
        shadow: ["0 0 8px var(--chakra-colors-cyan-600)", "0 0 8px var(--chakra-colors-orange-600)", 
            "0 0 8px var(--chakra-colors-pink-600)" ]
    }
};