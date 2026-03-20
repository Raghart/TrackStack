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

export interface SwitchTagsStyles {
    Vocals: SwitchStyle;
    Instrumental: SwitchStyle;
    Happy: SwitchStyle;
    Sad: SwitchStyle;
    Acoustic: SwitchStyle;
    Electronic: SwitchStyle;
};

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

export interface SliderStylesOptions {
    Energy: SliderStylesProps;
    Danceability: SliderStylesProps;
    Tempo: SliderStylesProps;
    Sentiment: SliderStylesProps;
};