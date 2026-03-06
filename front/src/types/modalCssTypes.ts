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

interface SliderStylesProps {
    threshold: number[];
    SliderBg: string[];
    Icon: IconType[];
    IconColor: string[];
    IconBorder: string[];
    shadow: string[];
};

export interface SliderStylesOptions {
    Energy: SliderStylesProps;
    Danceability: SliderStylesProps;
    Tempo: SliderStylesProps;
    Sentiment: SliderStylesProps;
};

export interface SliderTagsOptions {
    Relaxed: SliderTagsProps;
    Active: SliderTagsProps;
    Intense: SliderTagsProps;
    Calm: SliderTagsProps;
    Rhythmic: SliderTagsProps;
    Energetic: SliderTagsProps;
    "70 BPM": SliderTagsProps;
    "120 BPM": SliderTagsProps;
    "230 BPM": SliderTagsProps;
    "😌": SliderTagsProps;
    "🙂": SliderTagsProps;
    "😝": SliderTagsProps;
};