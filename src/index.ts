// tslint:disable: no-console
import { ApolloServer } from 'apollo-server';
import  bikeresolver  from './resolvers/cargobike';

import typeDefs from './schema/type-defs';

const server = new ApolloServer({
    resolvers:[bikeresolver],
    typeDefs
});

server.listen()
  .then(({ url }) => console.log(`Server ready at ${url} `));

