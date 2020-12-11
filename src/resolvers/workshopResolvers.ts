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
import { Participant } from '../model/Participant';
import { PermissionError } from '../errors/PermissionError';

export default {
    Query: {
        workshopTypeById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadWorkshop)) {
                return dataSources.workshopAPI.workshopTypeById(id);
            } else {
                throw new PermissionError();
            }
        },
        workshopTypes: (_: any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadWorkshop)) {
                return dataSources.workshopAPI.workshopTypes(offset, limit);
            } else {
                throw new PermissionError();
            }
        },
        workshopById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadWorkshop)) {
                return dataSources.workshopAPI.workshopById(id);
            } else {
                throw new PermissionError();
            }
        },
        workshops: (_: any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadWorkshop)) {
                return dataSources.workshopAPI.workshops(offset, limit);
            } else {
                throw new PermissionError();
            }
        }
    },
    Workshop: {
        trainer1: (parent: any, __:any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadParticipant)) {
                return dataSources.workshopAPI.trainer1ByWorkshopId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        trainer2: (parent: any, __:any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadParticipant)) {
                return dataSources.workshopAPI.trainer2ByWorkshopId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        participants (parent: any, _: any, { dataSources, req }: { dataSources: any; req: any }): Promise<Participant[]> {
            if (req.permissions.includes(Permission.ReadParticipant)) {
                return dataSources.workshopAPI.participantsByWorkshopId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        workshopType (parent: any, _: any, { dataSources, req }: { dataSources: any; req: any }) {
            if (req.permissions.includes(Permission.ReadWorkshop)) {
                return dataSources.workshopAPI.workshopTypeByWorkshopId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    WorkshopType: {
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    Mutation: {
        createWorkshop: (_: any, { workshop }: { workshop: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshop)) {
                return dataSources.workshopAPI.createWorkshop(workshop);
            } else {
                throw new PermissionError();
            }
        },
        lockWorkshop: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshop)) {
                return dataSources.workshopAPI.lockWorkshop(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        unlockWorkshop: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshop)) {
                return dataSources.workshopAPI.unlockWorkshop(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        updateWorkshop: (_: any, { workshop }: { workshop: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshop)) {
                return dataSources.workshopAPI.updateWorkshop(workshop, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        deleteWorkshop: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteWorkshop)) {
                return dataSources.workshopAPI.deleteWorkshop(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        createWorkshopType: (_: any, { workshopType }: { workshopType: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshopType)) {
                return dataSources.workshopAPI.createWorkshopType(workshopType);
            } else {
                throw new PermissionError();
            }
        },
        lockWorkshopType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshopType)) {
                return dataSources.workshopAPI.lockWorkshopType(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        unlockWorkshopType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshopType)) {
                return dataSources.workshopAPI.unlockWorkshopType(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        updateWorkshopType: (_: any, { workshopType }: { workshopType: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshopType)) {
                return dataSources.workshopAPI.updateWorkshopType(workshopType, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        deleteWorkshopType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteWorkshopType)) {
                return dataSources.workshopAPI.deleteWorkshopType(id, req.userId);
            } else {
                throw new PermissionError();
            }
        }
    }
};
