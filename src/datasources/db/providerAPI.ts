import { DataSource } from 'apollo-datasource';
import { GraphQLError } from 'graphql';
import { Connection, getConnection } from 'typeorm';
import { Provider } from '../../model/Provider';

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

    async createProvider (provider: any) {
        let inserts: any;
        try {
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
                await entityManager.getRepository(Provider)
                    .createQueryBuilder('provider')
                    .relation(Provider, 'contactPersons')
                    .of(inserts.identifiers[0].id)
                    .add(provider.contactPersonIds);
            });
        } catch (e: any) {
            console.log(e);
            return new GraphQLError('Transaction could not be completed');
        }
        const ret = inserts.generatedMaps[0];
        ret.id = inserts.identifiers[0].id;
        return ret;
    }
}
