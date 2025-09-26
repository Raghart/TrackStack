import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv"; dotenv.config();

const elasticSearchService = new Client({node: process.env.LOCAL_ES_NODE});

const createArtistIndex = async () : Promise<string> => {
    await elasticSearchService.indices.create({
        index: "artists",
        settings: {
            analysis: {
                analyzer: {
                    autocomplete: {
                        type: "custom",
                        tokenizer: "standard",
                        filter: ["lowercase", "asciifolding", "edge_ngram"]
                    },
                    edge_ngram_analyzer: {
                        type: "custom",
                        tokenizer: "standard",
                        filter: ["lowercase", "asciifolding", "edge_ngram"],
                    },
                    ngram_analyzer: {
                        type: "custom",
                        tokenizer: "standard",
                        filter: ["lowercase", "asciifolding", "ngram"]
                    }
                },
                filter: {
                    edge_ngram: {
                        type: "edge_ngram",
                        min_gram: 1,
                        max_gram: 20
                    },
                    ngram: {
                        type: "ngram",
                        min_gram: 2,
                        max_gram: 3
                    }
                },
                normalizer: {
                    lowercase_ascii: {
                        type: "custom",
                        filter: ["lowercase", "asciifolding"]
                    }
                }
            }
        },
        mappings: {
            properties: {
                id: { type: "integer" },
                name: {
                    type: "text",
                    analyzer: "autocomplete",
                    search_analyzer: "standard",
                    fields: {
                        edge: {
                            type: "text",
                            analyzer: "edge_ngram_analyzer"
                        },
                        ngram: {
                            type: "text",
                            analyzer: "ngram_analyzer",
                        },
                        keyword: {
                            type: "keyword",
                            normalizer: "lowercase_ascii"
                        }
                    },
                },
                album_cover: { type: "keyword" },
                type: { type: "keyword" },
            }
        }
    })
    return "ok";
};

createArtistIndex();