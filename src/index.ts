import { ApolloServer } from 'apollo-server'
import bikeresolver from './resolvers/cargobikeResolver'
import { CargoBikeAPI } from './datasources/db/cargobikeAPI'
import typeDefs from './schema/type-defs'
import 'reflect-metadata'
import { createConnection } from 'typeorm'

createConnection().then(async () => {
    console.log('connected to db')
}).catch(error => console.log(error))

const server = new ApolloServer({
    resolvers: [bikeresolver],
    typeDefs,
    dataSources: () => ({
        cargoBikeAPI: new CargoBikeAPI()
    })
})

console.log(__dirname)
server.listen()
    .then(({ url }) => console.log(`Server ready at ${url} `))
