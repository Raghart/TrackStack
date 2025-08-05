import { setVoiceType, setMood, setAcousticness } from "@/reducers/recommendReducer";
import { AcousticnessOptions, MoodOptions, SwitchOptionsType, VoiceTypeOptions } from "@/types/RecDataTypes";

const voiceSwitch: SwitchOptionsType<VoiceTypeOptions> = { 
    title: "Voice Type", 
    labels: [
        { label: "Vocals", description: "The song includes vocals"}, 
        { label: "Instrumental", description: "The song is instrumental only"},
    ],
    setValue: setVoiceType
};

const MoodSwitch: SwitchOptionsType<MoodOptions> = { 
    title: "Mood", labels: [
        { label: "Happy", description: "Happy vibes 😃"}, 
        { label: "Sad", description: "Sad vibes 😢"},
    ], 
    setValue: setMood,
};

const AcousticnessSwitch: SwitchOptionsType<AcousticnessOptions> = { 
    title: "Acousticness", labels: [ 
        { label: "Electronic", description: "Electronic sounds"},
        { label: "Acoustic", description: "Instrumental sounds"},
    ], 
    setValue: setAcousticness,
};

export const SwitchDataOptions = [ voiceSwitch, MoodSwitch, AcousticnessSwitch ];
