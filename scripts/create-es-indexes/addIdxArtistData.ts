import { Client } from "@elastic/elasticsearch";
import { artistSearchResults } from "../../src/types/searchTypes";
import { getArtists } from "./getAllArtists";
import dotenv from "dotenv"; dotenv.config();

const elasticSearchService = new Client({ node: process.env.LOCAL_ES_NODE });

const addArtistsData = async (artist: artistSearchResults) => {
    return elasticSearchService.index({
        index: "artists",
        id: artist.id.toString(),
        document: artist
    });
};

const addIndexArtistsData = async () : Promise<string> => {
    const allArtists =  await getArtists();
    for (const artist of allArtists) {
        await addArtistsData(artist);
    };
    return "Artists indexed successfully!";
};

addIndexArtistsData();