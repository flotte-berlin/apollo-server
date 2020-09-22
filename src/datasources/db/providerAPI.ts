import { DataSource } from 'apollo-datasource';
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
}
