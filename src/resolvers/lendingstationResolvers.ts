import { Permission } from '../datasources/userserver/permission';
import { GraphQLError } from 'graphql';
import { LendingStation } from '../model/LendingStation';

export default {
    Query: {
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
