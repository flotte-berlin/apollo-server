import { Permission } from '../datasources/userserver/permission';
import { GraphQLError } from 'graphql';

export default {
    Query: {
        cargoBikeById: (_: any, { id }:{id: any}, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.findCargoBikeById({ id });
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        cargoBikes: (_: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.getCargoBikes();
            } else {
                return new GraphQLError('Insufficiant Permissions');
            }
        }
    },
    Mutation: {
        addBike: (_: any, { id, name }:{id: any, name:string}, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.updateBike({ id, name });
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createCargoBike: (_: any, { cargoBike }: { cargoBike: any }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.createCargoBike({ cargoBike });
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateCargoBike: (_: any, { cargoBike }: { cargoBike: any }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.updateCargoBike({ cargoBike });
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
