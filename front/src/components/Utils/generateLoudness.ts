import randInRange from "./randInRange";

const generateLoudness = (mood: number, sentiment: number) : number => {
    switch (true) {
        case sentiment > 0.8 && mood === 1:
            return randInRange(-3, 0);
        case sentiment > 0.6 && mood === 1:
            return randInRange(-6, -3);
        case mood === 1:
            return randInRange(-10,-3);
        case sentiment > 0.4 && mood == 0:
            return randInRange(-20, -10)
        default:
            return randInRange(-50, -21);
    }
};

export default generateLoudness;