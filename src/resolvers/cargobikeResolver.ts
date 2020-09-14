import { Permission } from '../datasources/userserver/permission';
import { GraphQLError } from 'graphql';

export default {
    Query: {
        CargobikeById: (_: any, { id, token }:{id: any, token: string}, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.findCargoBikeById({ id, token });
            } else {
                throw new GraphQLError('Insufficient Permissions');
            }
        }
    },
    Mutation: {
        addBike: (_: any, { id, token, name }:{id: any, token: string, name:string}, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.updateBike({ id, token, name });
            } else {
                throw new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
