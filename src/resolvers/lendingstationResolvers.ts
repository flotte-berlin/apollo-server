import { Permission } from '../datasources/userserver/permission';
import { GraphQLError } from 'graphql';
import { LendingStation } from '../model/LendingStation';

export default {
    Query: {
    },
    Mutation: {
        lendingStation: (_: any, { lendingStation }:{ lendingStation: LendingStation }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return new GraphQLError('Not implemented');
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
