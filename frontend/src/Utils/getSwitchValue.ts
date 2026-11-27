export const getSwitchValue = (title: string, label: string) : number => {
    switch (title) {
        case "Voice Type":
            return label === "Vocals" ? 0.05 : 0.9;
        case "Mood":
            return label === "😃 Happy" ? 1 : 0;
        case "Acousticness":
            return label === "Electronic" ? 0.15 : 0.85;
        default:
            throw new Error("This section doesn't form part of the valid Switch Options.")
    };
};