import { GraphQLError } from 'graphql';
import { Permission } from '../datasources/userserver/permission';

export default {
    Query: {
        participantById: (_: any, { id }: { id: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.participantAPI.getParticipantById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        participants: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.participantAPI.getParticipants(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    },
    Participant: {
        engagement (parent: any, _: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.participantAPI.engagementByParticipantId(parent.id);
        },
        contactInformation (parent: any, _: any, { dataSources, req }: { dataSources: any, req: any }) {
            return (dataSources.participantAPI.contactInformationByParticipantId(parent.id));
        }
    },
    Engagement: {
        cargoBike (parent: any, _: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.cargoBikeAPI.findCargoBikeByEngagementId(parent.id);
        },
        participant (parent: any, _: any, { dataSources, req }: { dataSources: any, req: any }) {
            return dataSources.participantAPI.participantByEngagementId(parent.id);
        }
    },
    Mutation: {
        createParticipant: (_: any, { participant }: { participant: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.participantAPI.createParticipant(participant);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createContactInformation: (_: any, { contactInformation }: { contactInformation: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.participantAPI.createContactInformation(contactInformation);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createEngagement: (_: any, { engagement }: { engagement: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.participantAPI.createEngagement(engagement);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
