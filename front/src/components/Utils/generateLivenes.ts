import randInRange from "./randInRange";

const generateLiveness = (mood: number, sentiment: number) : number => {
    switch (true) {
        case sentiment > 0.8 && mood === 1:
            return randInRange(0.8, 0.95);
        case sentiment > 0.6 && mood === 1:
            return randInRange(0.6, 0.8);
        case mood === 1:
            return randInRange(0.5, 0.7);
        case sentiment > 0.3 && mood == 0:
            return randInRange(0.3, 0.5)
        default:
            return randInRange(0.05, 0.3);
    }
};

export default generateLiveness;