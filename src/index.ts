import { ApolloServer } from 'apollo-server-express';
import bikeresolver from './resolvers/cargobikeResolver';
import { CargoBikeAPI } from './datasources/db/cargobikeAPI';
import typeDefs from './schema/type-defs';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { UserServerAPI } from './datasources/userserver/userserviceAPI';
import express from 'express';
import { requiredPermissions } from './datasources/userserver/permission';

require('dotenv').config();

/**
 * Function that is called to authenticate a user by using the user rpc server
 * @param req
 * @param res
 * @param next
 */
async function authenticate (req: any, res: any, next: any) {
    if (process.env.NODE_ENV === 'develop') {
        req.permissions = requiredPermissions.map((e) => e.name);
        next();
    } else {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            if (await userAPI.validateToken(token)) {
                req.permissions = await userAPI.getUserPermissions(token);
                next();
            } else {
                res.status(401);
                res.send('Unauthorized');
            }
        } else {
            res.status(401);
            res.send('Unauthorized');
        }
    }
}

createConnection({
    type: 'postgres',
    url: process.env.POSTGRES_CONNECTION_URL
}).then(async () => {
    console.log('connected to db');
}).catch(error => console.log(error));

const userAPI = new UserServerAPI(process.env.RPC_HOST);

const server = new ApolloServer({
    resolvers: [bikeresolver],
    typeDefs,
    dataSources: () => ({
        cargoBikeAPI: new CargoBikeAPI(),
        userAPI
    }),
    context: (req: any) => {
        return req;
    }
});

const app = express();

app.post('/graphql', authenticate);
app.get(/\/graphql?&.*query=/, authenticate);
server.applyMiddleware({ app });

console.log(__dirname);
app.listen(4000, async () => {
    console.log('Server listening on port 4000');
    await userAPI.createDefinedPermissions();
});
