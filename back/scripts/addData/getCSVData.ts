import fs from "fs";
import csv from "csv-parser"
import { Readable } from "stream";
import { formatTag } from "./utils/formatTag";
import { TypeSong } from "./Typesong";

const getCSVData = async (startRow: number, endRow: number): Promise<TypeSong[]> => {
    const csvResults: TypeSong[] = [];
    const stream = fs.createReadStream("full_songs_DB.csv").pipe(csv());
    let currentRow = 0;

    for await (const row of Readable.from(stream)) {
        currentRow++

        if (currentRow < startRow) continue;
        if (currentRow > endRow) break;
        
        csvResults.push({ ...row, tags: row.tags.split(",").map((tag: string) => formatTag(tag.trim())) });
    };

    return csvResults;
}

export default getCSVData;
