import { userVectorSchema } from "@trackstack/schemas";
import minMaxScale from "./minMaxScale";
import { weightRecommendations } from "@/components/constants/WeightData";
import { acousticnessMAX, acousticnessMIN, danceabilityMax, danceabilityMin, energyMAX, energyMIN, instrumentalnessMAX, instrumentalnessMIN, modeMax, modeMin, speechinessMAX, speechinessMIN, tempoMAX, tempoMIN, valenceMAX, valenceMIN } from "@/components/constants/ModalC";

const generateUserVector = (tempo: number, danceability: number, energy: number,
    mood: number, speechLevel: number, acousticness: number, voiceType: number,
    sentiment: number
) => {
    const danceabilityNor = minMaxScale(
        danceability, 
        danceabilityMin, danceabilityMax) * weightRecommendations.danceability;

    const energyNor = minMaxScale(energy, energyMIN, energyMAX) * weightRecommendations.energy;
    const modeNor = minMaxScale(mood, modeMin, modeMax) * weightRecommendations.mood;

    const speechinessNor = minMaxScale(
        speechLevel, 
        speechinessMIN, 
        speechinessMAX) * (speechLevel === 0.165 ? 
            weightRecommendations.speechLevel[0] : weightRecommendations.speechLevel[1]);

    const acousticnessNor = minMaxScale(
        acousticness, 
        acousticnessMIN, 
        acousticnessMAX) * (acousticness == 0.15 ? 
            weightRecommendations.acousticness[0] : weightRecommendations.acousticness[1]);

    const instrumentalnessNor = minMaxScale(
        voiceType, 
        instrumentalnessMIN, 
        instrumentalnessMAX) * (voiceType == 0.05 ? 
            weightRecommendations.voiceType[0] : weightRecommendations.voiceType[1]);
            
    const valenceNor = minMaxScale(
        sentiment, valenceMIN, valenceMAX) * weightRecommendations.sentiment;

    const tempoNor = minMaxScale(tempo, tempoMIN, tempoMAX) * weightRecommendations.tempo;

    return userVectorSchema.parse([
        danceabilityNor,
        energyNor,
        modeNor,
        speechinessNor,
        acousticnessNor,
        instrumentalnessNor,
        valenceNor,
        tempoNor,
    ]);
};

export default generateUserVector;