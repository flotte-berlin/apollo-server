import { ApolloServer } from 'apollo-server-express';
import bikeResolver from './resolvers/cargoBikeResolver';
import { CargoBikeAPI } from './datasources/db/cargobikeAPI';
import typeDefs from './schema/type-defs';
import 'reflect-metadata';
import { ConnectionOptions, createConnection } from 'typeorm';
import { UserServerAPI } from './datasources/userserver/userserviceAPI';
import express from 'express';
import { requiredPermissions } from './datasources/userserver/permission';
import { CargoBike } from './model/CargoBike';
import { BikeEvent } from './model/BikeEvent';
import { ContactInformation } from './model/ContactInformation';
import { Equipment } from './model/Equipment';
import { LendingStation } from './model/LendingStation';
import { TimeFrame } from './model/TimeFrame';
import { Participant } from './model/Participant';
import { Organisation } from './model/Organisation';
import { Provider } from './model/Provider';
import { Engagement } from './model/Engagement';
import { Workshop } from './model/Workshop';
import { LendingStationAPI } from './datasources/db/lendingstationAPI';
import lendingStationResolvers from './resolvers/lendingStationResolvers';
import { ParticipantAPI } from './datasources/db/participantAPI';
import participantResolvers from './resolvers/participantResolvers';
import { ContactInformationAPI } from './datasources/db/contactinformationAPI';
import providerResolvers from './resolvers/providerResolvers';
import { ProviderAPI } from './datasources/db/providerAPI';
import contactInformationResolvers from './resolvers/contactInformationResolvers';
import { Person } from './model/Person';
import { WorkshopType } from './model/WorkshopType';
import { EngagementType } from './model/EngagementType';
import { EquipmentType } from './model/EquipmentType';
import { BikeEventType } from './model/BikeEventType';
import { WorkshopAPI } from './datasources/db/workshopAPI';
import workshopResolvers from './resolvers/workshopResolvers';
import { ActionLog } from './model/ActionLog';
import actionLogResolvers from './resolvers/actionLogResolvers';
import { ActionLogAPI } from './datasources/db/actionLogAPI';
const cors = require('cors');
require('dotenv').config();

const connOptions: ConnectionOptions = {
    type: 'postgres',
    url: process.env.POSTGRES_CONNECTION_URL,
    entities: [
        CargoBike,
        BikeEvent,
        BikeEventType,
        ContactInformation,
        Equipment,
        EquipmentType,
        LendingStation,
        TimeFrame,
        Organisation,
        Participant,
        Provider,
        Engagement,
        EngagementType,
        Workshop,
        Person,
        WorkshopType,
        ActionLog
    ],
    synchronize: true,
    logging: false
};
/**
 * Function that is called to authenticate a user by using the user rpc server
 * @param req
 * @param res
 * @param next
 */
async function authenticate (req: any, res: any, next: any) {
    if (process.env.NODE_ENV === 'develop') {
        req.permissions = requiredPermissions.map((e) => e.name);
        req.userId = await userAPI.getUserId(req.headers.authorization?.replace('Bearer ', ''));
        next();
    } else {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            if (await userAPI.validateToken(token)) {
                req.permissions = await userAPI.getUserPermissions(token);
                req.userId = await userAPI.getUserId(req.headers.authorization?.replace('Bearer ', ''));
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

function retryConnect (): any {
    createConnection(connOptions).catch(error => {
        console.log(error);
        setTimeout(retryConnect, 3000);
    });
}

retryConnect();

const userAPI = new UserServerAPI(process.env.RPC_HOST);

const server = new ApolloServer({
    resolvers: [
        bikeResolver,
        lendingStationResolvers,
        participantResolvers,
        providerResolvers,
        contactInformationResolvers,
        workshopResolvers,
        actionLogResolvers
    ],
    typeDefs,
    dataSources: () => ({
        cargoBikeAPI: new CargoBikeAPI(),
        lendingStationAPI: new LendingStationAPI(),
        participantAPI: new ParticipantAPI(),
        contactInformationAPI: new ContactInformationAPI(),
        providerAPI: new ProviderAPI(),
        workshopAPI: new WorkshopAPI(),
        actionLogAPI: new ActionLogAPI(),
        userAPI
    }),
    context: (req: any) => {
        return req;
    }
});

const app = express();
app.use(cors());
app.post('/graphql', authenticate);
app.get(/\/graphql?&.*query=/, authenticate);

server.applyMiddleware({ app });
app.listen(4000, async () => {
    await userAPI.createDefinedPermissions().catch(
        err => console.log(err));
});
