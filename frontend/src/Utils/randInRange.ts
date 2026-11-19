const randInRange = (min: number, max: number) : number => {
    return min + Math.random() * (max - min)
};

export default randInRange;