import { Permission } from '../datasources/userserver/permission';
import { GraphQLError } from 'graphql';
import { LendingStation } from '../model/LendingStation';
import { isLocked } from '../datasources/db/utils';

export default {
    Query: {
        lendingStationById: (_: any, { id }: { id: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.lendingStationAPI.getLendingStationById({ id });
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lendingStations: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.lendingStationAPI.lendingStations(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        timeFrameById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.lendingStationAPI.timeFrameById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        timeframes: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.lendingStationAPI.timeFrames(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    },
    LendingStation: {
        timeFrames (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.lendingStationAPI.timeFramesByLendingStationId(parent.id);
        },
        numCargoBikes (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.lendingStationAPI.numCargoBikesByLendingStationId(parent.id);
        },
        cargoBikes (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.lendingStationAPI.cargoBikesByLendingStationId(parent.id);
        },
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    LoanPeriod: {
        loanTimes  (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return parent.loanTimes.split(',');
        }
    },
    TimeFrame: {
        from (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return (parent.dateRange as string).split(',')[0].replace('[', '');
        },
        to (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            const str = (parent.dateRange as string).split(',')[1].replace(')', '');
            return (str.length > 0) ? str : null;
        },
        cargoBike (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.cargoBikeAPI.cargoBikeByTimeFrameId(parent.id);
        },
        lendingStation (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.lendingStationAPI.lendingStationByTimeFrameId(parent.id);
        },
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    Mutation: {
        createLendingStation: (_: any, { lendingStation }:{ lendingStation: LendingStation }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.lendingStationAPI.createLendingStation(lendingStation);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockLendingStationById: (_: any, { id }:{ id: number }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.lendingStationAPI.lockLendingStationById(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockLendingStationById: (_: any, { id }:{ id: number }, { dataSources, req }:{dataSources: any, req: any }) => {
            return dataSources.lendingStationAPI.unlockLendingStationById(id, req.userId);
        },
        updateLendingStation: (_: any, { lendingStation }:{ lendingStation: LendingStation }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.lendingStationAPI.updateLendingStation({ lendingStation });
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createTimeFrame: (_: any, { timeFrame }:{ timeFrame: LendingStation }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.lendingStationAPI.createTimeFrame(timeFrame);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockTimeFrame: (_: any, { id }:{ id: number }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.lendingStationAPI.lockTimeFrame(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
