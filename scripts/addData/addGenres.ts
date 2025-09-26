import getCSVData from "./getCSVData";
import { Genres } from "./genres";
import { formatTag } from "./utils/formatTag";

const addGenres = async () => {
    const csvData = await getCSVData(1, 50230);
    const genreSet = new Set<string>();

    for (const row of csvData) {
        row.tags.forEach(tag => {
            const formatted = formatTag(tag);
            if (formatted !== "") genreSet.add(formatted);
        });
    }

    const uniqueGenres = [...genreSet];
    const UGenresObj = uniqueGenres.map(genre => ({ genre }));

    try {
        await Genres.bulkCreate(UGenresObj);
        console.log("All Genres added successfully!")
    } catch (err) {
        console.error("There was an error trying to add the genres", err)
    };
};

addGenres()