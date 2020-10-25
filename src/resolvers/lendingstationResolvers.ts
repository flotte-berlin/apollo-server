import { Permission } from '../datasources/userserver/permission';
import { GraphQLError } from 'graphql';
import { LendingStation } from '../model/LendingStation';
import { isLocked } from '../datasources/db/utils';

export default {
    Query: {
        lendingStationById: (_: any, { id }: { id: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadLendingStation)) {
                return dataSources.lendingStationAPI.lendingStationById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lendingStations: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
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
        timeframes: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
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
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    LoanPeriod: {
        loanTimes  (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) {
            return parent.loanTimes ? parent.loanTimes : [];
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
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    Mutation: {
        createLendingStation: (_: any, { lendingStation }:{ lendingStation: LendingStation }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteLendingStation)) {
                return dataSources.lendingStationAPI.createLendingStation(lendingStation);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockLendingStationById: (_: any, { id }:{ id: number }, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteLendingStation)) {
                return dataSources.lendingStationAPI.lockLendingStationById(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockLendingStationById: (_: any, { id }:{ id: number }, { dataSources, req }:{dataSources: any, req: any }) => {
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
        }
    }
};
