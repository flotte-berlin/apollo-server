import { DataSource } from 'apollo-datasource';
import { Connection, EntityManager, getConnection } from 'typeorm';
import { Provider } from '../../model/Provider';
import { Organisation } from '../../model/Organisation';
import { UserInputError } from 'apollo-server';
import { CargoBike } from '../../model/CargoBike';

export class ProviderAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    async providerById (id: number) {
        await this.connection.getRepository(Provider)
            .createQueryBuilder('provider')
            .select()
            .where('provider.id = :id', { id: id })
            .getOne().catch(() => { return null; });
    }

    async provider (offset: number, limit: number) {
        return await this.connection.getRepository(Provider)
            .createQueryBuilder('provider')
            .select()
            .offset(offset)
            .limit(limit)
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
            .relation(CargoBike, 'provider')
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

    async createOrganisation (organisation: any) {
        let inserts: any = null;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            inserts = await entityManager.getRepository(Organisation)
                .createQueryBuilder('o')
                .insert()
                .values([organisation])
                .execute();
            await entityManager.getRepository(Organisation).createQueryBuilder()
                .relation(Organisation, 'providerId')
                .of(inserts.identifiers[0].id)
                .set(organisation.providerId);
        });
        return inserts.generatedMaps[0];
    }
}
