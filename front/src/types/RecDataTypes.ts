import { setDanceability, setDuration, setEnergy, setSentiment } from "@/reducers/recommendReducer";
import { PayloadAction } from "@reduxjs/toolkit";
import { JSX } from "react";
import { SongResponse } from "./songTypes";

export interface SwitchOptionsType<T extends SwitchLabelType> {
    title: SwitchTitleOptions;
    labels: { label: T, description: string }[];
    setValue: (value: number) => PayloadAction<number>;
};

export interface SegmentButton {
    value: SpeechLevelOptions;
    bg: string;
    bgChecked: string;
    shadow: string;
    label: JSX.Element;
};

export interface SlidersDataTypes {
    title: SliderTitles;
    setValue: SliderSetter;
    step: number;
    labels: SliderLabels[];
    min: number;
    default: number;
    max: number;
};

export interface RecommendData {
    genres: string[];
    energy: number;
    speechLevel: number;
    danceability: number;
    duration: number;
    sentiment: number;
    voiceType: number;
    mood: number;
    acousticness: number;
    results: SongResponse[];
};

export type SpeechLevelOptions = "Mixed" | "Music" | "Speech";

export type VoiceTypeOptions = "Vocals" | "Instrumental";

export type MoodOptions = "Happy" | "Sad";

export type AcousticnessOptions = | "Acoustic" | "Electronic";

export type SliderTitles = "Energy" | "Danceability" | "Duration" | "Sentiment";

type EnergyLabels = "Relaxed" | "Active" | "Intense";

type DanceabilityLabels = "Calm" | "Rhythmic" | "Energetic";

type DurationLabels = "30 Seg" | "2.5 Min" | "5 Min";

type SentimentLabels = "😌" | "🙂" | "😝";

export type SliderLabels = EnergyLabels | DanceabilityLabels | DurationLabels | SentimentLabels;

type SliderSetter = typeof setEnergy | typeof setDanceability | typeof setDuration | typeof setSentiment;

type SwitchTitleOptions = "Voice Type" | "Mood" | "Acousticness";

export type SwitchLabelType = "Vocals" | "Happy" | "Acoustic" | "Instrumental" | "Sad" | "Electronic";