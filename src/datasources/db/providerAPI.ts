import { DataSource } from 'apollo-datasource';
import { Connection, EntityManager, getConnection } from 'typeorm';
import { Provider } from '../../model/Provider';
import { Organisation } from '../../model/Organisation';
import { UserInputError } from 'apollo-server';
import { CargoBike } from '../../model/CargoBike';
import { LendingStation } from '../../model/LendingStation';
import { ActionLogger, LockUtils } from './utils';
import { GraphQLError } from 'graphql';

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

    async provider (offset: number, limit: number) {
        return await this.connection.getRepository(Provider)
            .createQueryBuilder('provider')
            .select()
            .skip(offset)
            .take(limit)
            .getMany();
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

    async organisations (offset: number, limit: number) {
        return await this.connection.getRepository(Organisation)
            .createQueryBuilder('o')
            .select()
            .skip(offset)
            .limit(limit)
            .getMany();
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
                .relation(Provider, 'cargoBikes')
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
        const keepLock = provider.keepLock;
        delete provider.keepLock;
        const cargoBikes = provider.cargoBikeIds;
        delete provider.cargoBikeIds;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, Provider, 'p', provider.id, userId)) {
                throw new GraphQLError('Provider is locked by another user');
            }
            await ActionLogger.log(entityManager, Provider, 'p', provider, userId);
            await entityManager.getRepository(Provider)
                .createQueryBuilder('p')
                .update()
                .set({ ...provider })
                .where('id = :id', { id: provider.id })
                .execute().then(value => { if (value.affected !== 1) { throw new GraphQLError('ID not found'); } });
            await entityManager.getRepository(Provider)
                .createQueryBuilder('p')
                .relation(Provider, 'cargoBikeIds')
                .of(provider.id)
                .add(cargoBikes);
        });
        !keepLock && await this.unlockProvider(provider.id, userId);
        return await this.providerById(provider.id);
    }

    async createOrganisation (organisation: any) {
        let inserts: any = null;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            inserts = await entityManager.getRepository(Organisation)
                .createQueryBuilder('o')
                .insert()
                .values([organisation])
                .execute();
        });
        return inserts.generatedMaps[0];
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
                throw new GraphQLError('Organisation is locked by another user');
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
}
