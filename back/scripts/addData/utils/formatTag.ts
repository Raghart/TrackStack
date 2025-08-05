export const formatTag = (tag: string) => {
    const formatted = tag.trim().replace(/_/g," ").split(" ").map((word: string) => word.charAt(0).toUpperCase() + 
            word.slice(1).toLocaleLowerCase()).join(" ");

        return formatted.trim();
};