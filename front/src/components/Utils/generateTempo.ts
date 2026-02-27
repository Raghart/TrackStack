import { tempoMAX } from "../constants/ModalC";
import randInRange from "./randInRange";

const generateTempo = (mood: number, sentiment: number) : number => {
    switch (true) {
        case sentiment > 0.9 && mood === 1:
            return randInRange(220, tempoMAX);
        case sentiment > 0.8 && mood === 1:
            return randInRange(200, 220);
        case sentiment > 0.7 && mood === 1:
            return randInRange(180, 200);
        case sentiment > 0.6 && mood === 1:
            return randInRange(160, 180);
        case mood === 1:
            return randInRange(140, 160);
        case sentiment > 0.4 && mood === 0:
            return randInRange(120, 140);
        case sentiment > 0.3 && mood === 0:
            return randInRange(80, 120);
        case sentiment > 0.2 && mood === 0:
            return randInRange(60, 80);
        default:
            return randInRange(40, 60);
    }
};

export default generateTempo;