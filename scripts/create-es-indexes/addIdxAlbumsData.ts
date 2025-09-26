import { Client } from "@elastic/elasticsearch";
import { albumSearchResults } from "../../src/types/searchTypes";
import { getAllAlbums } from "./getAllAlbums";
import dotenv from "dotenv"; dotenv.config();

export const elasticSearchService = new Client({ node: process.env.LOCAL_ES_NODE });

const addAlbumsData = async (album: albumSearchResults) => {
    return elasticSearchService.index({
        index: "albums",
        id: album.id.toString(),
        document: album
    });
};

const addIndexAlbumsData = async (): Promise<string> => {
    const allAlbums = await getAllAlbums();
    for (const album of allAlbums) {
        await addAlbumsData(album);
    };
    return "Albums indexed successfully!";
};

addIndexAlbumsData();