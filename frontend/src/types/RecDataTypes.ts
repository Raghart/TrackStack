import { setDanceability, setTempo, setEnergy, setSentiment } from "@/reducers/recommendReducer";
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
    message: string;
    energy: number;
    speechLevel: number;
    danceability: number;
    tempo: number;
    sentiment: number;
    voiceType: number;
    mood: number;
    acousticness: number;
    results: SongResponse[];
};

export interface WeightRecommendations {
    energy: number;
    speechLevel: readonly [number, number];
    danceability: number;
    tempo: number;
    sentiment: number;
    voiceType: readonly [number, number];
    mood: number;
    acousticness: readonly [number, number];
}

export type SpeechLevelOptions = "Mixed" | "Music" | "Speech";

export type VoiceTypeOptions = "Vocals" | "Instrumental";

export type MoodOptions = "Happy" | "Sad";

export type AcousticnessOptions = | "Acoustic" | "Electronic";

export type SliderTitles = "Energy" | "Danceability" | "Tempo" | "Sentiment";

type EnergyLabels = "Relaxed" | "Active" | "Intense";

type DanceabilityLabels = "Calm" | "Rhythmic" | "Energetic";

type TempoLabels = "70 BPM" | "120 BPM" | "230 BPM";

type SentimentLabels = "😌" | "🙂" | "😝";

export type SliderLabels = EnergyLabels | DanceabilityLabels | TempoLabels | SentimentLabels;

type SliderSetter = typeof setEnergy | typeof setDanceability | typeof setTempo | typeof setSentiment;

type SwitchTitleOptions = "Voice Type" | "Mood" | "Acousticness";

export type SwitchLabelType = "Vocals" | "Happy" | "Acoustic" | "Instrumental" | "Sad" | "Electronic";