import { acousticnessMAX, acousticnessMIN, danceabilityMax, danceabilityMin, durationMax, durationMin, 
    energyMAX, energyMIN, 
    instrumentalnessMAX, 
    instrumentalnessMIN, 
    livenessMAX, 
    livenessMIN, 
    loudnessMAX, 
    loudnessMIN, 
    modeMax, 
    modeMin, 
    speechinessMAX, 
    speechinessMIN, 
    tempoMAX, 
    tempoMIN, 
    valenceMAX,
    valenceMIN} from "../constants/ModalC";
import generateLiveness from "./generateLivenes";
import generateLoudness from "./generateLoudness";
import generateTempo from "./generateTempo";
import minMaxScale from "./minMaxScale";

const generateUserVector = (duration: number, danceability: number, energy: number,
    mood: number, speechLevel: number, acousticness: number, voiceType: number,
    sentiment: number
) : number[] => {
    const liveness = generateLiveness(mood, sentiment);
    const tempo = generateTempo(mood, sentiment);
    const loudness = generateLoudness(mood, energy);

    const durationNor = 0;
    const danceabilityNor = minMaxScale(danceability, danceabilityMin, danceabilityMax);
    const energyNor = minMaxScale(energy, energyMIN, energyMAX);
    const trackKeyNor = 0;
    const loudnessNor = minMaxScale(loudness, loudnessMIN, loudnessMAX);
    const modeNor = minMaxScale(mood, modeMin, modeMax);
    const speechinessNor = minMaxScale(speechLevel, speechinessMIN, speechinessMAX);
    const acousticnessNor = minMaxScale(acousticness, acousticnessMIN, acousticnessMAX);
    const instrumentalnessNor = minMaxScale(voiceType, instrumentalnessMIN, instrumentalnessMAX);
    const livenessNor = minMaxScale(liveness, livenessMIN, livenessMAX);
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