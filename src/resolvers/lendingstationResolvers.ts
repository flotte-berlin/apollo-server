import { Permission } from '../datasources/userserver/permission';
import { GraphQLError } from 'graphql';
import { LendingStation } from '../model/LendingStation';

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
        timeframes: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.lendingStationAPI.timeFrames(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    },
    LendingStation: {
        contactPersons (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.contactInformationAPI.contactPersonsByLendingStationId(parent.id);
        },
        timeFrames (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.lendingStationAPI.timeFramesByLendingStationId(parent.id);
        },
        numCargoBikes (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.lendingStationAPI.numCargoBikesByLendingStationId(parent.id);
        },
        cargoBikes (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.lendingStationAPI.cargoBikesByLendingStationId(parent.id);
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
        }
    },
    Mutation: {
        createLendingStation: (_: any, { lendingStation }:{ lendingStation: LendingStation }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.lendingStationAPI.createLendingStation(lendingStation);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
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
        }
    }
};
