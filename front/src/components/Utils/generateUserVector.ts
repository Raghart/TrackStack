import { acousticnessMAX, acousticnessMIN, danceabilityMax, danceabilityMin, 
    energyMAX, energyMIN, 
    instrumentalnessMAX, 
    instrumentalnessMIN, 
    modeMax, 
    modeMin, 
    speechinessMAX, 
    speechinessMIN, 
    tempoMAX, 
    tempoMIN, 
    valenceMAX,
    valenceMIN} from "../constants/ModalC";
import { weightRecommendations } from "../constants/WeightData";
import minMaxScale from "./minMaxScale";

const generateUserVector = (tempo: number, danceability: number, energy: number,
    mood: number, speechLevel: number, acousticness: number, voiceType: number,
    sentiment: number
) : number[] => {
    const danceabilityNor = minMaxScale(
        danceability, 
        danceabilityMin, danceabilityMax) * weightRecommendations.danceability;

    const energyNor = minMaxScale(energy, energyMIN, energyMAX) * weightRecommendations.energy;
    const modeNor = minMaxScale(mood, modeMin, modeMax) * weightRecommendations.mood;

    const speechinessNor = minMaxScale(
        speechLevel, speechinessMIN, speechinessMAX) * weightRecommendations.speechLevel;

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

    return [
        danceabilityNor,
        energyNor,
        modeNor,
        speechinessNor,
        acousticnessNor,
        instrumentalnessNor,
        valenceNor,
        tempoNor,
    ]
}

export default generateUserVector;