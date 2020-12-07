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

import { DataSource } from 'apollo-datasource';
import { Connection, EntityManager, getConnection } from 'typeorm';
import { Provider } from '../../model/Provider';
import { Organisation } from '../../model/Organisation';
import { UserInputError } from 'apollo-server-express';
import { CargoBike } from '../../model/CargoBike';
import { LendingStation } from '../../model/LendingStation';
import { ActionLogger, DBUtils, LockUtils } from './utils';
import { ResourceLockedError } from '../../errors/ResourceLockedError';
import { NotFoundError } from '../../errors/NotFoundError';

export class ProviderAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    async providerById (id: number) {
        return await this.connection.getRepository(Provider)
            .createQueryBuilder('provider')
            .select()
            .where('id = :id', { id: id })
            .getOne();
    }

    async provider (offset?: number, limit?: number) {
        return await DBUtils.getAllEntity(this.connection, Provider, 'p', offset, limit);
    }

    async providerByOrganisationId (id: number) {
        return await this.connection.getRepository(Provider)
            .createQueryBuilder('p')
            .select()
            .where('p."organisationId" = :id', { id: id })
            .getOne();
    }

    async providerByCargoBikeId (id: number) {
        return await this.connection.getRepository(CargoBike)
            .createQueryBuilder('cb')
            .relation(CargoBike, 'providerId')
            .of(id)
            .loadOne();
    }

    async organisationByProviderId (id: number) {
        return await this.connection.getRepository(Provider)
            .createQueryBuilder()
            .relation(Provider, 'organisationId')
            .of(id)
            .loadOne();
    }

    async organisations (offset?: number, limit?: number) {
        return await DBUtils.getAllEntity(this.connection, Organisation, 'o', offset, limit);
    }

    async organisationById (id: number) {
        return await this.connection.getRepository(Organisation)
            .createQueryBuilder('o')
            .select()
            .where('id = :id', { id: id })
            .getOne();
    }

    async organisationByLendingStationId (id: number) {
        return await this.connection.getRepository(LendingStation)
            .createQueryBuilder('ls')
            .relation(LendingStation, 'organisationId')
            .of(id)
            .loadOne();
    }

    async lendingStationByOrganisationId (id: number) {
        return await this.connection.getRepository(Organisation)
            .createQueryBuilder('o')
            .relation(Organisation, 'lendingStations')
            .of(id)
            .loadMany();
    }

    async contactInformationByOrganisationId (id: number) {
        return await this.connection.getRepository(Organisation)
            .createQueryBuilder('o')
            .relation(Organisation, 'contactInformationId')
            .of(id)
            .loadOne();
    }

    async privatePersonByProviderId (id: number) {
        return await this.connection.getRepository(Provider)
            .createQueryBuilder('p')
            .relation(Provider, 'privatePersonId')
            .of(id)
            .loadOne();
    }

    async createProvider (provider: any) {
        if (!provider.privatePersonId === !provider.organisationId) { return new UserInputError('Provider must have either privatePersonId or organisationId'); }
        let inserts: any = null;
        await this.connection.transaction(async (entityManager: any) => {
            inserts = await entityManager.getRepository(Provider)
                .createQueryBuilder('provider')
                .insert()
                .values([provider])
                .returning('*')
                .execute();
            await entityManager.getRepository(Provider)
                .createQueryBuilder('provider')
                .relation(Provider, 'cargoBikeIds')
                .of(inserts.identifiers[0].id)
                .add(provider.cargoBikeIds);
        });
        const ret = inserts.generatedMaps[0];
        ret.id = inserts.identifiers[0].id;
        return ret;
    }

    async lockProvider (id: number, userId: number) {
        return await LockUtils.lockEntity(this.connection, Provider, 'p', id, userId);
    }

    async unlockProvider (id: number, userId: number) {
        return await LockUtils.unlockEntity(this.connection, Provider, 'p', id, userId);
    }

    async updateProvider (provider: any, userId: number) {
        // make sure that a provider cannot have both organisation and person at the same time
        if (provider.privatePersonId && provider.organisationId) { return new UserInputError('Provider must have either privatePersonId or organisationId'); }
        if (provider.privatePersonId) {
            provider.organisationId = null;
        } else if (provider.organisationId) {
            provider.privatePersonId = null;
        }

        const keepLock = provider.keepLock;
        delete provider.keepLock;
        const cargoBikes = provider.cargoBikeIds;
        delete provider.cargoBikeIds;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, Provider, 'p', provider.id, userId)) {
                throw new ResourceLockedError('Provider');
            }
            await ActionLogger.log(entityManager, Provider, 'p', provider, userId);
            await entityManager.getRepository(Provider)
                .createQueryBuilder('p')
                .update()
                .set({ ...provider })
                .where('id = :id', { id: provider.id })
                .execute().then(value => {
                    if (value.affected !== 1) {
                        throw new NotFoundError('Provider', 'id', provider.id);
                    }
                });
            await entityManager.getRepository(Provider)
                .createQueryBuilder('p')
                .relation(Provider, 'cargoBikeIds')
                .of(provider.id)
                .add(cargoBikes);
        });
        !keepLock && await this.unlockProvider(provider.id, userId);
        return await this.providerById(provider.id);
    }

    async deleteProvider (id: number, userId: number) {
        return await DBUtils.deleteEntity(this.connection, Provider, 'p', id, userId);
    }

    async createOrganisation (organisation: any) {
        let createdOrganisation: any = null;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            const result = await entityManager.getRepository(Organisation)
                .createQueryBuilder('o')
                .insert()
                .values([organisation])
                .execute();
            createdOrganisation = await entityManager.getRepository(Organisation).findOne(result.identifiers[0].id);
        });

        return createdOrganisation;
    }

    async lockOrganisation (id: number, userId: number) {
        return await LockUtils.lockEntity(this.connection, Organisation, 'o', id, userId);
    }

    async unlockOrganisation (id: number, userId: number) {
        return await LockUtils.unlockEntity(this.connection, Organisation, 'o', id, userId);
    }

    async updateOrganisation (organisation: any, userId: number) {
        const keepLock = organisation.keepLock;
        delete organisation.keepLock;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, Organisation, 'o', organisation.id, userId)) {
                throw new ResourceLockedError('Organisation');
            }
            await ActionLogger.log(entityManager, Organisation, 'o', organisation, userId);
            await entityManager.getRepository(Organisation)
                .createQueryBuilder('o')
                .update()
                .set({ ...organisation })
                .where('id = :id', { id: organisation.id })
                .execute();
        });
        !keepLock && await LockUtils.unlockEntity(this.connection, Organisation, 'o', organisation.id, userId);
        return this.organisationById(organisation.id);
    }

    async deleteOrganisation (id: number, userId: number) {
        return await DBUtils.deleteEntity(this.connection, Organisation, 'o', id, userId);
    }
}
