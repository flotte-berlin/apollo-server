import { Permission } from '../datasources/userserver/permission';
import { GraphQLError } from 'graphql';
import { isLocked } from '../datasources/db/utils';

export default {
    Query: {
        workshopTypeById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadWorkshop)) {
                return dataSources.workshopAPI.workshopTypeById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        workshopTypes: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadWorkshop)) {
                return dataSources.workshopAPI.workshopTypes(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        workshopById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadWorkshop)) {
                return dataSources.workshopAPI.workshopById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        workshops: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadWorkshop)) {
                return dataSources.workshopAPI.workshops(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    },
    Workshop: {
        trainer1: (parent: any, __:any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadParticipant)) {
                return dataSources.workshopAPI.trainer1ByWorkshopId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        trainer2: (parent: any, __:any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadParticipant)) {
                return dataSources.workshopAPI.trainer2ByWorkshopId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    WorkshopType: {
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    Mutation: {
        createWorkshop: (_: any, { workshop }: { workshop: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshop)) {
                return dataSources.workshopAPI.createWorkshop(workshop);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockWorkshop: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshop)) {
                return dataSources.workshopAPI.lockWorkshop(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockWorkshop: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshop)) {
                return dataSources.workshopAPI.unlockWorkshop(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateWorkshop: (_: any, { workshop }: { workshop: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshop)) {
                return dataSources.workshopAPI.updateWorkshop(workshop, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        deleteWorkshop: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteWorkshop)) {
                return dataSources.workshopAPI.deleteWorkshop(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createWorkshopType: (_: any, { workshopType }: { workshopType: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshopType)) {
                return dataSources.workshopAPI.createWorkshopType(workshopType);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockWorkshopType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshopType)) {
                return dataSources.workshopAPI.lockWorkshopType(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockWorkshopType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshopType)) {
                return dataSources.workshopAPI.unlockWorkshopType(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateWorkshopType: (_: any, { workshopType }: { workshopType: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshopType)) {
                return dataSources.workshopAPI.updateWorkshopType(workshopType, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        deleteWorkshopType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteWorkshopType)) {
                return dataSources.workshopAPI.deleteWorkshopType(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
