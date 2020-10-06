import { Permission } from '../datasources/userserver/permission';
import { GraphQLError } from 'graphql';
import { isLocked } from '../datasources/db/utils';

export default {
    Query: {
        cargoBikeById: (_: any, { id }:{id: any}, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.findCargoBikeById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        cargoBikes: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.getCargoBikes(offset, limit);
            } else {
                return new GraphQLError('Insufficiant Permissions');
            }
        },
        bikeEventById: (_:any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.findBikeEventById(id);
            } else {
                return new GraphQLError('Insufficiant Permissions');
            }
        },
        equipment: (_:any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.getEquipment(offset, limit);
            } else {
                return new GraphQLError('Insufficiant Permissions');
            }
        },
        equipmentById: (_:any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.findEquipmentJoinBikeById(id);
            } else {
                return new GraphQLError('Insufficiant Permissions');
            }
        },
        bikeEventTypes: (_:any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.bikeEventTypes(offset, limit);
            } else {
                return new GraphQLError('Insufficiant Permissions');
            }
        }
    },
    CargoBike: {
        engagement (parent: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.participantAPI.engagementByCargoBikeId(offset, limit, parent.id);
        },
        coordinator (parent: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) {
            dataSources.participantAPI.participantByCargoBikeId(parent.id);
        },
        equipment (parent: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.cargoBikeAPI.equipmentByCargoBikeId(offset, limit, parent.id);
        },
        lendingStation (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.lendingStationAPI.lendingStationByCargoBikeId(parent.id);
        },
        bikeEvents (parent: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.cargoBikeAPI.bikeEventsByCargoBikeId(parent.id, offset, limit);
        },
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req }),
        lockedBy (): any {
            return null;
        },
        timeFrames (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.lendingStationAPI.timeFramesByCargoBikeId(parent.id);
        },
        equipmentType (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.cargoBikeAPI.equipmentTypeByCargoBikeId(parent.id);
        },
        provider (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.providerAPI.providerByCargoBikeId(parent.id);
        }

    },
    Equipment: {
        cargoBike (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.cargoBikeAPI.cargoBikeByEquipmentId(parent.id);
        },
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    BikeEvent: {
        cargoBike (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.cargoBikeAPI.cargoBikeByEventId(parent.id);
        },
        bikeEventType (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.cargoBikeAPI.bikeEventTypeByBikeEventId(parent.id);
        },
        responsible (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.cargoBikeAPI.responsibleByBikeEventId(parent.id);
        },
        related (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.cargoBikeAPI.relatedByBikeEventId(parent.id);
        },
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    BikeEventType: {
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    Mutation: {
        createCargoBike: (_: any, { cargoBike }: { cargoBike: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.createCargoBike({ cargoBike });
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockCargoBikeById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.lockCargoBike(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockCargoBikeById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.unlockCargoBike(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateCargoBike: (_: any, { cargoBike }: { cargoBike: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.updateCargoBike(cargoBike, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createBikeEvent: (_: any, { bikeEvent }: { bikeEvent: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.createBikeEvent({ bikeEvent });
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockBikeEventById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.lockBikeEvent(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockBikeEventById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.unlockBikeEvent(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createEquipment: (_: any, { equipment }: { equipment: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.createEquipment({ equipment });
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockEquipmentById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.lockEquipment(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockEquipmentById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.unlockEquipment(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateEquipment: (_: any, { equipment }: { equipment: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.updateEquipment(equipment, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createEquipmentType: (_: any, { equipmentType }: { equipmentType: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEquipmentType)) {
                return dataSources.cargoBikeAPI.createEquipmentType(equipmentType);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createBikeEventType: (_: any, { name }: { name: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEventType)) {
                return dataSources.cargoBikeAPI.createBikeEventType(name);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
