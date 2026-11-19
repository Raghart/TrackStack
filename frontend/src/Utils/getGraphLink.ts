import { getEnvHttpLink, getEnvWsLink } from "@/config/env";
import { HttpLink, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
  uri: getEnvHttpLink(),
});

const wsLink = new GraphQLWsLink(createClient({
  url: getEnvWsLink(),
}));

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error] ${operation.operationName}: ${message}`, { locations, path })
    );
  }
  if (networkError) {
    console.error(`[Network error] ${operation.operationName}: ${networkError.message}`, networkError);
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  httpLink
);

export const graphLink = errorLink.concat(splitLink);