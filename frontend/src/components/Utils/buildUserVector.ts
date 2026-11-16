import { recommendInitialState } from "@/reducers/recommendReducer";
import generateUserVector from "./generateUserVector";

export const buildUserVector = (tempo: number, danceability: number, energy: number,
    mood: number, speechLevel: number, acousticness: number, voiceType: number,
    sentiment: number
) => {
    try {
        return generateUserVector(tempo, danceability, energy, mood, speechLevel,
            acousticness, voiceType, sentiment);
    } catch (err) {
        console.error("Unable to build the user vector from the current settings", err);
        return generateUserVector(
            recommendInitialState.tempo,
            recommendInitialState.danceability,
            recommendInitialState.energy,
            recommendInitialState.mood,
            recommendInitialState.speechLevel,
            recommendInitialState.acousticness,
            recommendInitialState.voiceType,
            recommendInitialState.sentiment,
        );
    };
};