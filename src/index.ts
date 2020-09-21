import { ApolloServer } from 'apollo-server-express';
import bikeresolver from './resolvers/cargobikeResolver';
import { CargoBikeAPI } from './datasources/db/cargobikeAPI';
import typeDefs from './schema/type-defs';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { UserServerAPI } from './datasources/userserver/userserviceAPI';
import express from 'express';
import { requiredPermissions } from './datasources/userserver/permission';
import { CargoBike } from './model/CargoBike';
import { BikeEvent } from './model/BikeEvent';
import { BikeModel } from './model/BikeModel';
import { ContactInformation } from './model/ContactInformation';
import { Equipment } from './model/Equipment';
import { LendingStation } from './model/LendingStation';
import { LoanPeriod } from './model/LoanPeriod';
import { Participant } from './model/Participant';
import { Organization } from './model/Organization';
import { Provider } from './model/Provider';
import { Engagement } from './model/Engagement';
import { Workshop } from './model/Workshop';
import { LendingStationAPI } from './datasources/db/lendingstationAPI';
import lendingstationResolvers from './resolvers/lendingstationResolvers';
import { ParticipantAPI } from './datasources/db/participantAPI';
import participantResolvers from './resolvers/participantResolvers';
import { ContactPerson } from './model/ContactPerson';

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
    url: process.env.POSTGRES_CONNECTION_URL,
    entities: [
        CargoBike,
        BikeEvent,
        BikeModel,
        ContactInformation,
        Equipment,
        LendingStation,
        LoanPeriod,
        Organization,
        Participant,
        Provider,
        Engagement,
        Workshop,
        ContactPerson
    ],
    synchronize: true,
    logging: false
}).then(async () => {
    console.log('connected to db');
}).catch(error => console.log(error));

const userAPI = new UserServerAPI(process.env.RPC_HOST);

const server = new ApolloServer({
    resolvers: [
        bikeresolver,
        lendingstationResolvers,
        participantResolvers
    ],
    typeDefs,
    dataSources: () => ({
        cargoBikeAPI: new CargoBikeAPI(),
        lendingStationAPI: new LendingStationAPI(),
        participantAPI: new ParticipantAPI(),
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
