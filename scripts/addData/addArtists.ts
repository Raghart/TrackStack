import getCSVData from "./getCSVData";
import { Artists } from "./artists";

const addArtists = async () => {
    const csvData = await getCSVData(1, 50230);
    const artistSet = new Set<string>();
    
    for (const row of csvData) {
        row.artist.split(",").forEach(art => artistSet.add(art.trim()));
    };

    const uniqueArtists: string[] = [...artistSet];
    const UArtistsObj = uniqueArtists.map(name => ({ name }));

    try {
        await Artists.bulkCreate(UArtistsObj);
        console.log("All Artists added without issue!");
    } catch (err) {
        console.error("There was an error trying to add the Artists ", err);
    };
};

addArtists();