import { Permission } from '../datasources/userserver/permission';
import { GraphQLError } from 'graphql';
import { LendingStation } from '../model/LendingStation';

export default {
    Query: {
        lendingStationById: (_: any, { id }: { id: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.lendingStationAPI.getLendingStationById({ id });
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lendingStations: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.lendingStationAPI.lendingStations(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    },
    LendingStation: {
        contactPersons (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.contactInformationAPI.contactPersonByLendingStationId(parent.id);
        },
        timeFrames (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.lendingStationAPI.timeFramesByLendingStationId(parent.id);
        },
        numCargoBikes (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.lendingStationAPI.numCargoBikesByLendingStationId(parent.id);
        },
        cargoBikes (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.lendingStationAPI.cargoBikesByLendingStationId(parent.id);
        }
    },
    Mutation: {
        createLendingStation: (_: any, { lendingStation }:{ lendingStation: LendingStation }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.lendingStationAPI.createLendingStation({ lendingStation });
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateLendingStation: (_: any, { lendingStation }:{ lendingStation: LendingStation }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.lendingStationAPI.updateLendingStation({ lendingStation });
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
