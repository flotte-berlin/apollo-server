import { GraphQLError } from 'graphql';
import { Permission } from '../datasources/userserver/permission';
import { isLocked, isLockedByMe } from '../datasources/db/utils';

export default {
    Query: {
        providers: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadProvider)) {
                return dataSources.providerAPI.provider(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        providerById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadProvider)) {
                return dataSources.providerAPI.providerById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        organisations: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadOrganisation)) {
                return dataSources.providerAPI.organisations(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        organisationById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadOrganisation)) {
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
            if (req.permissions.includes(Permission.ReadOrganisation)) {
                return dataSources.providerAPI.organisationByProviderId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        privatePerson: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.providerAPI.privatePersonByProviderId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    Organisation: {
        provider: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadProvider)) {
                return dataSources.providerAPI.providerByOrganisationId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        contactInformation: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.providerAPI.contactInformationByOrganisationId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lendingStations: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadLendingStation)) {
                return dataSources.providerAPI.lendingStationByOrganisationId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    Mutation: {
        createProvider: (_: any, { provider }: { provider: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteProvider)) {
                return dataSources.providerAPI.createProvider(provider);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockProvider: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteProvider)) {
                return dataSources.providerAPI.lockProvider(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockProvider: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteProvider)) {
                return dataSources.providerAPI.unlockProvider(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateProvider: (_: any, { provider }: { provider: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteProvider)) {
                return dataSources.providerAPI.updateProvider(provider, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        deleteProvider: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteProvider)) {
                return dataSources.providerAPI.deleteProvider(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createOrganisation: (_: any, { organisation }: { organisation: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteOrganisation)) {
                return dataSources.providerAPI.createOrganisation(organisation);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockOrganisation: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteOrganisation)) {
                return dataSources.providerAPI.lockOrganisation(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockOrganisation: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteOrganisation)) {
                return dataSources.providerAPI.unlockOrganisation(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateOrganisation: (_: any, { organisation }: { organisation: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteOrganisation)) {
                return dataSources.providerAPI.updateOrganisation(organisation, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        deleteOrganisation: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteOrganisation)) {
                return dataSources.providerAPI.deleteOrganisation(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
