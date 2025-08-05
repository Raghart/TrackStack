import { Client } from "elasticsearch";
import dotenv from "dotenv"; dotenv.config();

export const bonsaiClientProvider = {
    provide: "BonsaiClient",
    useFactory: async () => {
        return new Client({
            host: process.env.ELASTICSEARCH_NODE,
            log: "error",
            ssl: { rejectUnauthorized: false }
        })
    }
};