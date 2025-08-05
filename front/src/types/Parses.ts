import { isString, isNumber } from "./verify";

export const parseString = (text: unknown): string => {
    if (!text || !isString(text)) {
        throw new Error(`${text} is not a valid string!`);
    };

    return text;
};

export const parseNumber = (number: unknown): number => {
    if (!isString(number) || !isNumber(number)) {
        console.log(number)
        throw new Error(`${number} is not a valid number!`);
    };

    return parseInt(number);
};