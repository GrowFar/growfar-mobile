import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://35.219.79.80:5015/graphql',
  cache: new InMemoryCache(),
});

export default client;
