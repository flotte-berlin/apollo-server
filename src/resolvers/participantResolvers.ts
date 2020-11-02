import { GraphQLError } from 'graphql';
import { Permission } from '../datasources/userserver/permission';
import { isLocked } from '../datasources/db/utils';

export default {
    Query: {
        participantById: (_: any, { id }: { id: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadParticipant)) {
                return dataSources.participantAPI.getParticipantById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        participants: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadParticipant)) {
                return dataSources.participantAPI.getParticipants(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        engagementById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadEngagement)) {
                return dataSources.participantAPI.engagementById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        engagements: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadEngagement)) {
                return dataSources.participantAPI.engagements(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        engagementTypeById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadEngagement)) {
                return dataSources.participantAPI.engagementTypeById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        engagementTypes: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadEngagement)) {
                return dataSources.participantAPI.engagementTypes(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    },
    Participant: {
        engagement (parent: any, _: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadEngagement)) {
                return dataSources.participantAPI.engagementByParticipantId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        contactInformation (parent: any, _: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return (dataSources.participantAPI.contactInformationByParticipantId(parent.id));
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        workshops (parent: any, _: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadWorkshop)) {
                return (dataSources.participantAPI.workshopsByParticipantId(parent.id));
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    Engagement: {
        cargoBike (parent: any, _: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.findCargoBikeByEngagementId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        participant (parent: any, _: any, { dataSources, req }: { dataSources: any, req: any }) {
            if (req.permissions.includes(Permission.ReadParticipant)) {
                return dataSources.participantAPI.participantByEngagementId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        engagementType (parent: any, _: any, { dataSources, req }: { dataSources: any; req: any }) {
            if (req.permissions.includes(Permission.ReadEngagement)) {
                return dataSources.participantAPI.engagementTypeByEngagementId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        from (parent: any) {
            return (parent.dateRange as string).split(',')[0].replace('[', '');
        },
        to (parent: any) {
            const str = (parent.dateRange as string).split(',')[1].replace(')', '');
            return (str.length > 0) ? str : null;
        },
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    Mutation: {
        createParticipant: (_: any, { participant }: { participant: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteParticipant)) {
                return dataSources.participantAPI.createParticipant(participant);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockParticipant: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteParticipant)) {
                return dataSources.participantAPI.lockParticipant(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockParticipant: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteParticipant)) {
                return dataSources.participantAPI.unlockeParticipant(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateParticipant: (_: any, { participant }: { participant: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteParticipant)) {
                return dataSources.participantAPI.updateParticipant(participant, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        deleteParticipant: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteParticipant)) {
                return dataSources.participantAPI.deleteParticipant(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createEngagement: (_: any, { engagement }: { engagement: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagement)) {
                return dataSources.participantAPI.createEngagement(engagement);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockEngagement: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagement)) {
                return dataSources.participantAPI.lockEngagement(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockEngagement: (_: any, { id }: {id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagement)) {
                return dataSources.participantAPI.unlockEngagement(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateEngagement: (_: any, { engagement }: { engagement: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagement)) {
                return dataSources.participantAPI.updateEngagement(engagement, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        deleteEngagement: (_: any, { id }: {id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteEngagement)) {
                return dataSources.participantAPI.deleteEngagement(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createEngagementType: (_: any, { engagementType }: { engagementType: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagementType)) {
                return dataSources.participantAPI.createEngagementType(engagementType);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockEngagementType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagementType)) {
                return dataSources.participantAPI.lockEngagementType(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockEngagementType: (_: any, { id }: {id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagementType)) {
                return dataSources.participantAPI.unlockEngagementType(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateEngagementType: (_: any, { engagementType }: { engagementType: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteEngagementType)) {
                return dataSources.participantAPI.updateEngagementType(engagementType, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        deleteEngagementType: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteEngagementType)) {
                return dataSources.participantAPI.deleteEngagementType(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
