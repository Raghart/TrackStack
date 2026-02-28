import { setEnergy, setDanceability, setTempo, setSentiment } from "@/reducers/recommendReducer";
import { SlidersDataTypes } from "@/types/RecDataTypes";

export const SliderOptions: SlidersDataTypes[] = [
    { 
        title: "Energy", setValue: setEnergy, step: 0.01, labels: ["Relaxed", "Active", "Intense"], 
        min: 0, default: 0.5, max: 1 
    },
    { 
        title: "Danceability", setValue: setDanceability, step: 0.01, labels: ["Calm", "Rhythmic", "Energetic"], 
        min: 0, default: 0.5, max: 1 
    },
    { 
        title: "Tempo", setValue: setTempo, step:1, labels: ["70 BPM", "150 BPM", "230 BPM"], 
        min: 0, default: 120, max: 238
    },
    { 
        title: "Sentiment", setValue: setSentiment, step: 0.01, labels: ["😌", "🙂", "😝"], 
        min: 0, default: 0.5, max: 1 
    },
];