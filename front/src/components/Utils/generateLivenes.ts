import { livenessMAX } from "../constants/ModalC";
import randInRange from "./randInRange";

const generateLiveness = (mood: number, sentiment: number) : number => {
    switch (true) {
        case sentiment > 0.9 && mood === 1:
            return randInRange(0.9, livenessMAX);
        case sentiment > 0.8 && mood === 1:
            return randInRange(0.8, 0.9);
        case sentiment > 0.7 && mood === 1:
            return randInRange(0.7, 0.8);
        case sentiment > 0.6 && mood === 1:
            return randInRange(0.6, 0.7);
        case mood === 1:
            return randInRange(0.5, 0.6);
        case sentiment > 0.4 && mood == 0:
            return randInRange(0.4, 0.5);
        case sentiment > 0.3 && mood == 0:
            return randInRange(0.3, 0.4);
        case sentiment > 0.2 && mood === 0:
            return randInRange(0.2, 0.3);
        default:
            return randInRange(0.05, 0.1);
    }
};

export default generateLiveness;