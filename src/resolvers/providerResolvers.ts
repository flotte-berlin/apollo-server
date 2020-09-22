import { GraphQLError } from 'graphql';
import { Permission } from '../datasources/userserver/permission';

export default {
    Query: {
        providerById: (_: any, { id }: { id: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.providerAPI.providerById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    },
    Mutation: {
    }
};
