import { IconType } from "react-icons/lib";

export interface SwitchStyle {
    tagBg: string;
    ThumbBg: string;
    ThumbBackgroundBg: string;
    ThumbIcon: IconType;
    IconColor: string;
    ThumbBackgroundIcon: IconType;
    BackgroundIconColor: string;
    border: string;
};

export type SwitchType = "Vocals" | "Instrumental" | "Happy" | "Sad" | "Acoustic" | "Electronic";

export interface SliderTagsProps {
    bg: string;
    border: string;
};

export interface SliderStylesProps {
    threshold: number[];
    SliderBg: string[];
    Icon: IconType[];
    IconColor: string[];
    IconBorder: string[];
    shadow: string[];
};

export type SliderType = "Energy" | "Danceability" | "Tempo" | "Sentiment";