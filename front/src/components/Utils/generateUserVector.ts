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
import minMaxScale from "./minMaxScale";

const generateUserVector = (tempo: number, danceability: number, energy: number,
    mood: number, speechLevel: number, acousticness: number, voiceType: number,
    sentiment: number
) : number[] => {
    const durationNor = 0;
    const danceabilityNor = minMaxScale(danceability, danceabilityMin, danceabilityMax);
    const energyNor = minMaxScale(energy, energyMIN, energyMAX);
    const trackKeyNor = 0;
    const loudnessNor = 0;
    const modeNor = minMaxScale(mood, modeMin, modeMax);
    const speechinessNor = minMaxScale(speechLevel, speechinessMIN, speechinessMAX);
    const acousticnessNor = minMaxScale(acousticness, acousticnessMIN, acousticnessMAX);
    const instrumentalnessNor = minMaxScale(voiceType, instrumentalnessMIN, instrumentalnessMAX);
    const livenessNor = 0;
    const valenceNor = minMaxScale(sentiment, valenceMIN, valenceMAX);
    const tempoNor = minMaxScale(tempo, tempoMIN, tempoMAX);
    const timeSigNor = 0;
    
    const userVector = [
        durationNor,
        danceabilityNor,
        energyNor,
        trackKeyNor,
        loudnessNor,
        modeNor,
        speechinessNor,
        acousticnessNor,
        instrumentalnessNor,
        livenessNor,
        valenceNor,
        tempoNor,
        timeSigNor,
    ];

    return userVector
}

export default generateUserVector;