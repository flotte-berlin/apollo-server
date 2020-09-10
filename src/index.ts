// tslint:disable: no-console
import { ApolloServer } from 'apollo-server';
import  bikeresolver  from './resolvers/cargobikeResolver';
import { CargoBikeAPI } from './datasources/db/cargobikeAPI';
import typeDefs from './schema/type-defs';

const server = new ApolloServer({
    resolvers:[bikeresolver],
    typeDefs,
    dataSources: () => ({
        cargoBikeAPI: new CargoBikeAPI(),
      })
});

server.listen()
  .then(({ url }) => console.log(`Server ready at ${url} `));

