import { Permission } from '../datasources/userserver/permission';
import { GraphQLError } from 'graphql';

export default {
    Query: {
        actionLog: (_: any, __:any, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadActionLog)) {
                return dataSources.actionLogAPI.actionLogByUserId(req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        actionLogByUser: (_: any, { id }: {id: number}, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadActionLogAll)) {
                return dataSources.actionLogAPI.actionLogByUserId(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        actionLogAll: (_: any, __: any, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadActionLogAll)) {
                return dataSources.actionLogAPI.actionLogAll();
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
