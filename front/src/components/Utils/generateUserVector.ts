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
    timeSigMax, 
    timeSigMin, 
    trackKeyMAX, 
    trackKeyMIN,
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
    const tempo = generateTempo(sentiment);
    const loudness = generateLoudness(mood, sentiment);
    
    const durationNor = minMaxScale(duration, durationMin, durationMax);
    const danceabilityNor = minMaxScale(danceability, danceabilityMin, danceabilityMax);
    const energyNor = minMaxScale(energy, energyMIN, energyMAX);
    const trackKeyNor = minMaxScale(4, trackKeyMIN, trackKeyMAX);
    const loudnessNor = minMaxScale(loudness, loudnessMIN, loudnessMAX);
    const modeNor = minMaxScale(mood, modeMin, modeMax);
    const speechinessNor = minMaxScale(speechLevel, speechinessMIN, speechinessMAX);
    const acousticnessNor = minMaxScale(acousticness, acousticnessMIN, acousticnessMAX);
    const instrumentalnessNor = minMaxScale(voiceType, instrumentalnessMIN, instrumentalnessMAX);
    const livenessNor = minMaxScale(liveness, livenessMIN, livenessMAX);
    const valenceNor = minMaxScale(sentiment, valenceMIN, valenceMAX);
    const tempoNor = minMaxScale(tempo, tempoMIN, tempoMAX);
    const timeSigNor = minMaxScale(4, timeSigMin, timeSigMax);
    
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