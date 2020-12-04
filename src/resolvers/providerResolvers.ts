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
        providers: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadProvider)) {
                return dataSources.providerAPI.provider(offset, limit);
            } else {
                throw new PermissionError();
            }
        },
        providerById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadProvider)) {
                return dataSources.providerAPI.providerById(id);
            } else {
                throw new PermissionError();
            }
        },
        organisations: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadOrganisation)) {
                return dataSources.providerAPI.organisations(offset, limit);
            } else {
                throw new PermissionError();
            }
        },
        organisationById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadOrganisation)) {
                return dataSources.providerAPI.organisationById(id);
            } else {
                throw new PermissionError();
            }
        }
    },
    Provider: {
        cargoBikes: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.cargoBikeAPI.cargoBikesByProviderId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        organisation: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadOrganisation)) {
                return dataSources.providerAPI.organisationByProviderId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        privatePerson: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.providerAPI.privatePersonByProviderId(parent.id);
            } else {
                throw new PermissionError();
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
                throw new PermissionError();
            }
        },
        contactInformation: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.providerAPI.contactInformationByOrganisationId(parent.id);
            } else {
                throw new PermissionError();
            }
        },
        lendingStations: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadLendingStation)) {
                return dataSources.providerAPI.lendingStationByOrganisationId(parent.id);
            } else {
                throw new PermissionError();
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
                throw new PermissionError();
            }
        },
        lockProvider: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteProvider)) {
                return dataSources.providerAPI.lockProvider(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        unlockProvider: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteProvider)) {
                return dataSources.providerAPI.unlockProvider(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        updateProvider: (_: any, { provider }: { provider: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteProvider)) {
                return dataSources.providerAPI.updateProvider(provider, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        deleteProvider: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteProvider)) {
                return dataSources.providerAPI.deleteProvider(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        createOrganisation: (_: any, { organisation }: { organisation: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteOrganisation)) {
                return dataSources.providerAPI.createOrganisation(organisation);
            } else {
                throw new PermissionError();
            }
        },
        lockOrganisation: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteOrganisation)) {
                return dataSources.providerAPI.lockOrganisation(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        unlockOrganisation: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteOrganisation)) {
                return dataSources.providerAPI.unlockOrganisation(id, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        updateOrganisation: (_: any, { organisation }: { organisation: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteOrganisation)) {
                return dataSources.providerAPI.updateOrganisation(organisation, req.userId);
            } else {
                throw new PermissionError();
            }
        },
        deleteOrganisation: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeleteOrganisation)) {
                return dataSources.providerAPI.deleteOrganisation(id, req.userId);
            } else {
                throw new PermissionError();
            }
        }
    }
};
