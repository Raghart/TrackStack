import { Client } from "@elastic/elasticsearch";
import { songSearchResults } from "../../src/types/searchTypes";
import { getAllSongs } from "./getAllSongs";
import dotenv from "dotenv"; dotenv.config();

const elasticSearchService = new Client({ node: process.env.LOCAL_ES_NODE });

const addSongsData = async (song: songSearchResults) => {
    return elasticSearchService.index({
        index: "songs",
        id: song.id.toString(),
        document: song
    })
};

const addIndexSongsData = async () : Promise<string> => {
    const allSongs = await getAllSongs();
    for (const song of allSongs) {
        await addSongsData(song);
    };
    return "Songs indexed successfully!";
};

addIndexSongsData();