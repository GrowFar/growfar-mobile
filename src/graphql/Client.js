import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://701af472b6ca.ngrok.io/graphql',
  cache: new InMemoryCache(),
});

export default client;
