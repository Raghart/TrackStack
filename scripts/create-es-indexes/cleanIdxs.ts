import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv"; dotenv.config();

const elasticSearchService = new Client({ node: process.env.LOCAL_ES_NODE });

const cleanIndexes = async () : Promise <string> => {
    await elasticSearchService.indices.delete({ index: 'songs' });
    await elasticSearchService.indices.delete({ index: 'albums' });
    await elasticSearchService.indices.delete({ index: 'artists' });
    return "Indexes cleaned!";
};

cleanIndexes();