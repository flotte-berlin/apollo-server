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
        participantById: (_: any, { id }: { id: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadParticipant)) {
                return dataSources.participantAPI.getParticipantById(id);
            } else {
                throw new PermissionError();
            }
        },
        participants: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadParticipant)) {
                return dataSources.participantAPI.getParticipants(offset, limit);
            } else {
                throw new PermissionError();
            }
        },
        engagementById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadEngagement)) {
                return dataSources.participantAPI.engagementById(id);
            } else {
                throw new PermissionError();
            }
        },
        engagements: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadEngagement)) {
                return dataSources.participantAPI.engagements(offset, limit);
            } else {
                throw new PermissionError();
            }
        },
        engagementTypeById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadEngagement)) {
                return dataSources.participantAPI.engagementTypeById(id);
            } else {
                throw new PermissionError();
            }
        },
        engagementTypes: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadEngagement)) {
                return dataSources.participantAPI.engagementTypes(offset, limit);
            } else {
                throw new PermissionError();
            }
        }
    },
    Participant: {
        engagement (parent: any, _: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadEngagement)) {
                return dataSources.participantAPI.engagementByParticipantId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        contactInformation (parent: any, _: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return (dataSources.participantAPI.contactInformationByParticipantId(parent.id));
            } else {
                throw new PermissionError();
            }
        },
        workshops (parent: any, _: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadWorkshop)) {
                return (dataSources.participantAPI.workshopsByParticipantId(parent.id));
            } else {
                throw new PermissionError();
            }
        },
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    Engagement: {
        cargoBike (parent: any, _: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.findCargoBikeByEngagementId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        participant (parent: any, _: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadParticipant)) {
                return dataSources.participantAPI.participantByEngagementId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        engagementType (parent: any, _: any, { dataSources, req }: { dataSources: any; req: any }) {
            if (req.permissions.includes(Permission.ReadEngagement)) {
                return dataSources.participantAPI.engagementTypeByEngagementId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        from (parent: any) {
            return (parent.dateRange as string).split(',')[0].replace('[', '');
        },
        to (parent: any) {
            const str = (parent.dateRange as string).split(',')[1].replace(')', '');
            return (str.length > 0) ? str : null;
        },
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    Mutation: {
        createParticipant: (_: any, { participant }: { participant: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteParticipant)) {
                return dataSources.participantAPI.createParticipant(participant);
            } else {
                throw new PermissionError();
            }
        },
        lockParticipant: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteParticipant)) {
                return dataSources.participantAPI.lockParticipant(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        unlockParticipant: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteParticipant)) {
                return dataSources.participantAPI.unlockeParticipant(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        updateParticipant: (_: any, { participant }: { participant: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteParticipant)) {
                return dataSources.participantAPI.updateParticipant(participant, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        deleteParticipant: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteParticipant)) {
                return dataSources.participantAPI.deleteParticipant(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        createEngagement: (_: any, { engagement }: { engagement: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagement)) {
                return dataSources.participantAPI.createEngagement(engagement);
            } else {
                throw new PermissionError();
            }
        },
        lockEngagement: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagement)) {
                return dataSources.participantAPI.lockEngagement(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        unlockEngagement: (_: any, { id }: {id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagement)) {
                return dataSources.participantAPI.unlockEngagement(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        updateEngagement: (_: any, { engagement }: { engagement: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagement)) {
                return dataSources.participantAPI.updateEngagement(engagement, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        deleteEngagement: (_: any, { id }: {id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteEngagement)) {
                return dataSources.participantAPI.deleteEngagement(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        createEngagementType: (_: any, { engagementType }: { engagementType: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagementType)) {
                return dataSources.participantAPI.createEngagementType(engagementType);
            } else {
                throw new PermissionError();
            }
        },
        lockEngagementType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagementType)) {
                return dataSources.participantAPI.lockEngagementType(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        unlockEngagementType: (_: any, { id }: {id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagementType)) {
                return dataSources.participantAPI.unlockEngagementType(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        updateEngagementType: (_: any, { engagementType }: { engagementType: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagementType)) {
                return dataSources.participantAPI.updateEngagementType(engagementType, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        deleteEngagementType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteEngagementType)) {
                return dataSources.participantAPI.deleteEngagementType(id, req.userId);
            } else {
                throw new PermissionError();
            }
        }
    }
};
