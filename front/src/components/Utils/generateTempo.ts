import randInRange from "./randInRange";

const generateTempo = (sentiment: number) : number => {
    switch (true) {
        case sentiment > 0.8:
            return randInRange(180, 220);
        case sentiment > 0.6:
            return randInRange(140, 170);
        case sentiment > 0.4:
            return randInRange(120, 150)
        default:
            return randInRange(40, 100);
    }
};

export default generateTempo;