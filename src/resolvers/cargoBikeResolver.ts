/*
Copyright (C) 2020  Leon Löchner

This file is part of fLotte-API-Server.

    fLotte-API-Server is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    fLotte-API-Server is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with fLotte-API-Server.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Permission } from '../datasources/userserver/permission';
import { isLocked, isLockedByMe } from '../datasources/db/utils';
import { PermissionError } from '../errors/PermissionError';

export default {
    Query: {
        cargoBikeById: (_: any, { id }:{id: any}, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.findCargoBikeById(id);
            } else {
                throw new PermissionError();
            }
        },
        cargoBikes: (_: any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.getCargoBikes(offset, limit);
            } else {
                throw new PermissionError();
            }
        },
        bikeEvents: (_:any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBikeEvent)) {
                return dataSources.cargoBikeAPI.bikeEvents(offset, limit);
            } else {
                throw new PermissionError();
            }
        },
        bikeEventById: (_:any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBikeEvent)) {
                return dataSources.cargoBikeAPI.bikeEventById(id);
            } else {
                throw new PermissionError();
            }
        },
        bikeEventTypeById: (_:any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBikeEvent)) {
                return dataSources.cargoBikeAPI.bikeEventTypeById(id);
            } else {
                throw new PermissionError();
            }
        },
        bikeEventTypes: (_:any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBikeEvent)) {
                return dataSources.cargoBikeAPI.bikeEventTypes(offset, limit);
            } else {
                throw new PermissionError();
            }
        },
        equipment: (_:any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadEquipment)) {
                return dataSources.cargoBikeAPI.getEquipment(offset, limit);
            } else {
                throw new PermissionError();
            }
        },
        equipmentById: (_:any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadEquipment)) {
                return dataSources.cargoBikeAPI.equipmentById(id);
            } else {
                throw new PermissionError();
            }
        },
        equipmentTypes: (_:any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadEquipment)) {
                return dataSources.cargoBikeAPI.equipmentTypes(offset, limit);
            } else {
                throw new PermissionError();
            }
        },
        equipmentTypeById: (_:any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadEquipment)) {
                return dataSources.cargoBikeAPI.equipmentTypeById(id);
            } else {
                throw new PermissionError();
            }
        },
        copyCargoBikeById: (_:any, { id }: {id:number}, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.copyCargoBikeById(id);
            } else {
                throw new PermissionError();
            }
        }
    },
    CargoBike: {
        currentEngagements (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadEngagement)) {
                return dataSources.participantAPI.currentEngagementByCargoBikeId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        engagement (parent: any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadEngagement)) {
                return dataSources.participantAPI.engagementByCargoBikeId(parent.id, offset, limit);
            } else {
                throw new PermissionError();
            }
        },
        participants (parent: any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) { // TODO should be done with engagements
            if (req.permissions.includes(Permission.ReadParticipant)) {
                return dataSources.participantAPI.participantsByCargoBikeId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        equipment (parent: any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadEquipment)) {
                return dataSources.cargoBikeAPI.equipmentByCargoBikeId(parent.id, offset, limit);
            } else {
                throw new PermissionError();
            }
        },
        lendingStation (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadLendingStation)) {
                return dataSources.lendingStationAPI.lendingStationByCargoBikeId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        bikeEvents (parent: any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadBikeEvent)) {
                return dataSources.cargoBikeAPI.bikeEventsByCargoBikeId(parent.id, offset, limit);
            } else {
                throw new PermissionError();
            }
        },
        timeFrames (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadTimeFrame)) {
                return dataSources.lendingStationAPI.timeFramesByCargoBikeId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        equipmentType (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadEquipment)) {
                return dataSources.cargoBikeAPI.equipmentTypeByCargoBikeId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        provider (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadProvider)) {
                return dataSources.providerAPI.providerByCargoBikeId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    NumRange: {
        min: (parent: string) => {
            return parent.replace(/^\[(.*),.*]$/, '$1');
        },
        max: (parent: string) => {
            return parent.replace(/^\[.*,(.*)]$/, '$1');
        }
    },
    Equipment: {
        cargoBike (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.cargoBikeByEquipmentId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    EquipmentType: {
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    BikeEvent: {
        cargoBike (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.cargoBikeByEventId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        bikeEventType (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadBikeEvent)) {
                return dataSources.cargoBikeAPI.bikeEventTypeByBikeEventId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        responsible (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadParticipant)) {
                return dataSources.cargoBikeAPI.responsibleByBikeEventId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        related (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadParticipant)) {
                return dataSources.cargoBikeAPI.relatedByBikeEventId(parent.workshopTypeId);
            } else {
                throw new PermissionError();
            }
        },
        documents: (parent: any) => {
            return (parent.documents) ? parent.documents : [];
        },
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    BikeEventType: {
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    InsuranceData: {
        projectAllowance: (parent: any): any => {
            return (parent.projectAllowance as string)?.replace(/€\$/, '');
        }
    },
    Mutation: {
        createCargoBike: (_: any, { cargoBike }: { cargoBike: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.createCargoBike(cargoBike);
            } else {
                throw new PermissionError();
            }
        },
        lockCargoBike: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.lockCargoBike(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        unlockCargoBike: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.unlockCargoBike(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        updateCargoBike: (_: any, { cargoBike }: { cargoBike: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.cargoBikeAPI.updateCargoBike(cargoBike, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        deleteCargoBike: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteBike)) {
                return dataSources.cargoBikeAPI.deleteCargoBike(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        createBikeEvent: (_: any, { bikeEvent }: { bikeEvent: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBikeEvent)) {
                return dataSources.cargoBikeAPI.createBikeEvent({ bikeEvent });
            } else {
                throw new PermissionError();
            }
        },
        lockBikeEvent: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBikeEvent)) {
                return dataSources.cargoBikeAPI.lockBikeEvent(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        unlockBikeEvent: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBikeEvent)) {
                return dataSources.cargoBikeAPI.unlockBikeEvent(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        updateBikeEvent: (_: any, { bikeEvent }: { bikeEvent: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBikeEvent)) {
                return dataSources.cargoBikeAPI.updateBikeEvent(bikeEvent, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        deleteBikeEvent: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteBikeEvent)) {
                return dataSources.cargoBikeAPI.deleteBikeEvent(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        createEquipment: (_: any, { equipment }: { equipment: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEquipment)) {
                return dataSources.cargoBikeAPI.createEquipment({ equipment });
            } else {
                throw new PermissionError();
            }
        },
        lockEquipment: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEquipment)) {
                return dataSources.cargoBikeAPI.lockEquipment(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        unlockEquipment: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEquipment)) {
                return dataSources.cargoBikeAPI.unlockEquipment(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        updateEquipment: (_: any, { equipment }: { equipment: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEquipment)) {
                return dataSources.cargoBikeAPI.updateEquipment(equipment, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        deleteEquipment: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteEquipment)) {
                return dataSources.cargoBikeAPI.deleteEquipment(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        createEquipmentType: (_: any, { equipmentType }: { equipmentType: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEquipmentType)) {
                return dataSources.cargoBikeAPI.createEquipmentType(equipmentType);
            } else {
                throw new PermissionError();
            }
        },
        lockEquipmentType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEquipmentType)) {
                return dataSources.cargoBikeAPI.lockEquipmentType(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        unlockEquipmentType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEquipmentType)) {
                return dataSources.cargoBikeAPI.unlockEquipmentType(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        updateEquipmentType: (_: any, { equipmentType }: { equipmentType: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEquipmentType)) {
                return dataSources.cargoBikeAPI.updateEquipmentType(equipmentType, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        deleteEquipmentType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteEquipmentType)) {
                return dataSources.cargoBikeAPI.deleteEquipmentType(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        createBikeEventType: (_: any, { bikeEventType }: { bikeEventType: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEventType)) {
                return dataSources.cargoBikeAPI.createBikeEventType(bikeEventType);
            } else {
                throw new PermissionError();
            }
        },
        lockBikeEventType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEventType)) {
                return dataSources.cargoBikeAPI.lockBikeEventType(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        unlockBikeEventType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEventType)) {
                return dataSources.cargoBikeAPI.unlockBikeEventType(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        updateBikeEventType: (_: any, { bikeEventType }: { bikeEventType: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEventType)) {
                return dataSources.cargoBikeAPI.updateBikeEventType(bikeEventType, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        deleteBikeEventType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteEventType)) {
                return dataSources.cargoBikeAPI.deleteBikeEventType(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        editCopyConfig: (_: any, { key, value }: { key: string, value: boolean }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.EditCopyConfig)) {
                return dataSources.cargoBikeAPI.editCopyConfig(key, value);
            } else {
                throw new PermissionError();
            }
        }
    }
};
