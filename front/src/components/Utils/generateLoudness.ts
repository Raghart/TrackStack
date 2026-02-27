import { loudnessMAX } from "../constants/ModalC";
import randInRange from "./randInRange";

const generateLoudness = (mood: number, sentiment: number) : number => {
    switch (true) {
        case sentiment > 0.9 && mood === 1:
            return randInRange(-3, loudnessMAX);
        case sentiment > 0.8 && mood === 1:
            return randInRange(-6, -3);
        case sentiment > 0.7 && mood === 1:
            return randInRange(-10, -6);
        case sentiment > 0.6 && mood === 1:
            return randInRange(-16, -10);
        case mood === 1:
            return randInRange(-22,-16);
        case sentiment > 0.4 && mood == 0:
            return randInRange(-30, -22);
        case sentiment > 0.3 && mood === 0:
            return randInRange(-40, -30);
        case sentiment > 0.2 && mood === 0:
            return randInRange(-50, -40);
        default:
            return randInRange(-60, -50);
    }
};

export default generateLoudness;