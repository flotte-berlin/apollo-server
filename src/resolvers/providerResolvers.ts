import { GraphQLError } from 'graphql';
import { Permission } from '../datasources/userserver/permission';
import { isLocked } from '../datasources/db/utils';

export default {
    Query: {
        providers: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.providerAPI.provider(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        providerById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.providerAPI.providerById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        organisations: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.providerAPI.organisations(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        organisationById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.providerAPI.organisationById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    },
    Provider: {
        cargoBikes: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.cargoBikesByProviderId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        organisation: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            return dataSources.providerAPI.organisationByProviderId(parent.id);
        },
        privatePerson: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            return dataSources.providerAPI.privatePersonByProviderId(parent.id);
        },
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    Organisation: {
        provider: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            return dataSources.providerAPI.providerByOrganisationId(parent.id);
        },
        contactInformation: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            return dataSources.providerAPI.contactInformationByOrganisationId(parent.id);
        },
        isLocked: (parent: any, __: any, { dataSources, req }: { dataSources: any; req: any }) => isLocked(parent, { dataSources, req })
    },
    Mutation: {
        createProvider: (_: any, { provider }: { provider: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.providerAPI.createProvider(provider);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createOrganisation: (_: any, { organisation }: { organisation: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteProvider)) {
                return dataSources.providerAPI.createOrganisation(organisation);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
