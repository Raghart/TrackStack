import { setEnergy, setDanceability, setDuration, setSentiment } from "@/reducers/recommendReducer";
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
        title: "Duration", setValue: setDuration, step:0.01, labels: ["30 Seg", "2.5 Min", "5 Min"], 
        min: 0.30, default: 2.6, max: 5
    },
    { 
        title: "Sentiment", setValue: setSentiment, step: 0.01, labels: ["😌", "🙂", "😝"], 
        min: 0, default: 0.5, max: 1 
    },
];