import { Permission } from '../datasources/userserver/permission';
import { GraphQLError } from 'graphql';

export default {
    Query: {
        CargobikeById: (_: any, { id }:{id: any}, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.findCargoBikeById({ id });
            } else {
                throw new GraphQLError('Insufficient Permissions');
            }
        }
    },
    Mutation: {
        addBike: (_: any, { id, name }:{id: any, name:string}, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.updateBike({ id, name });
            } else {
                throw new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
