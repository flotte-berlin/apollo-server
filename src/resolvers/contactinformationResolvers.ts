import { GraphQLError } from 'graphql';
import { Permission } from '../datasources/userserver/permission';
import { Person } from '../model/Person';
import { isLocked } from '../datasources/db/utils';

export default {
    Query: {
        contactInformation: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.contactInformationAPI.contactInformation(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        contactInformationById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.contactInformationAPI.contactInformationById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        personById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.contactInformationAPI.personById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        persons: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.contactInformationAPI.persons(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    },
    Person: {
        contactInformation: (parent: Person, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.contactInformationAPI.contactInformationByPersonId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    ContactInformation: {
        person: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.contactInformationAPI.personByContactInformationId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    Mutation: {
        createContactInformation: (_: any, { contactInformation }: { contactInformation: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WritePerson)) {
                return dataSources.contactInformationAPI.createContactInformation(contactInformation);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createPerson: (_: any, { person }: { person: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WritePerson)) {
                return dataSources.contactInformationAPI.createPerson(person);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
