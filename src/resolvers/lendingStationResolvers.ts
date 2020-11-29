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
import { GraphQLError } from 'graphql';
import { LendingStation } from '../model/LendingStation';
import { isLocked, isLockedByMe } from '../datasources/db/utils';

export default {
    Query: {
        lendingStationById: (_: any, { id }: { id: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadLendingStation)) {
                return dataSources.lendingStationAPI.lendingStationById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lendingStations: (_: any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadLendingStation)) {
                return dataSources.lendingStationAPI.lendingStations(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        timeFrameById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadTimeFrame)) {
                return dataSources.lendingStationAPI.timeFrameById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        timeFrames: (_: any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadTimeFrame)) {
                return dataSources.lendingStationAPI.timeFrames(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    },
    LendingStation: {
        timeFrames (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadTimeFrame)) {
                return dataSources.lendingStationAPI.timeFramesByLendingStationId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        numCargoBikes (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.lendingStationAPI.numCargoBikesByLendingStationId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        cargoBikes (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.lendingStationAPI.cargoBikesByLendingStationId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        contactInformationIntern (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.contactInformationAPI.contactInternByLendingStationId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        contactInformationExtern (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.contactInformationAPI.contactExternByLendingStationId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        organisation (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadOrganisation)) {
                return dataSources.providerAPI.organisationByLendingStationId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    LoanPeriod: {
        loanTimes  (parent: any) {
            return parent.loanTimes ? parent.loanTimes : [];
        }
    },
    DateRange: {
        from (parent: string) {
            return parent.split(',')[0].replace('[', '');
        },
        to (parent: string) {
            const str = parent.split(',')[1].replace(')', '');
            return (str.length > 0) ? str : null;
        }
    },
    TimeFrame: {
        cargoBike (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.cargoBikeByTimeFrameId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lendingStation (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadLendingStation)) {
                return dataSources.lendingStationAPI.lendingStationByTimeFrameId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    Mutation: {
        createLendingStation: (_: any, { lendingStation }:{ lendingStation: LendingStation }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteLendingStation)) {
                return dataSources.lendingStationAPI.createLendingStation(lendingStation);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockLendingStation: (_: any, { id }:{ id: number }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteLendingStation)) {
                return dataSources.lendingStationAPI.lockLendingStationById(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockLendingStation: (_: any, { id }:{ id: number }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteLendingStation)) {
                return dataSources.lendingStationAPI.unlockLendingStationById(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateLendingStation: (_: any, { lendingStation }:{ lendingStation: LendingStation }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteLendingStation)) {
                return dataSources.lendingStationAPI.updateLendingStation(lendingStation, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        deleteLendingStation: (_: any, { id }:{ id: number }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteLendingStation)) {
                return dataSources.lendingStationAPI.deleteLendingStationById(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createTimeFrame: (_: any, { timeFrame }:{ timeFrame: LendingStation }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteTimeFrame)) {
                return dataSources.lendingStationAPI.createTimeFrame(timeFrame);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockTimeFrame: (_: any, { id }:{ id: number }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteTimeFrame)) {
                return dataSources.lendingStationAPI.lockTimeFrame(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockTimeFrame: (_: any, { id }:{ id: number }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteTimeFrame)) {
                return dataSources.lendingStationAPI.unlockTimeFrame(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateTimeFrame: (_: any, { timeFrame }:{ timeFrame: LendingStation }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteTimeFrame)) {
                return dataSources.lendingStationAPI.updateTimeFrame(timeFrame, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        deleteTimeFrame: (_: any, { id }:{ id: number }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteTimeFrame)) {
                return dataSources.lendingStationAPI.deleteTimeFrame(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
