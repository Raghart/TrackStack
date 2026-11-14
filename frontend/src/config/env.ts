import { httpUrlSchema, wsUrlSchema } from "@trackstack/schemas/zod.parsers";

export const getEnvHttpLink = () => {
    return httpUrlSchema.parse(import.meta.env.VITE_GRAPHQL_URI);
};

export const getEnvWsLink = () => {
    return wsUrlSchema.parse(import.meta.env.VITE_SUBSCRIPTION_URI);
};