// tslint:disable: no-console
import { ApolloServer } from 'apollo-server';

// import resolvers from './resolvers';
import typeDefs from './schema/type-defs';

const server = new ApolloServer({ typeDefs });

server.listen()
  .then(({ url }) => console.log(`Server ready at ${url}.. `));

