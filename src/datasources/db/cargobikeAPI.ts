import { DataSource } from 'apollo-datasource';
import { getConnection, Connection } from 'typeorm';
import { CargoBike } from '../../model/CargoBike';
import { GraphQLError } from 'graphql';
/**
 * extended datasource to feed resolvers with data about cargoBikes
 */
export class CargoBikeAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    async getCargoBikes () {
        return await this.connection.createQueryBuilder()
            .select('cargoBikes')
            .from(CargoBike, 'cargoBikes')
            .getMany();
    }

    /**
     * Finds cargo bike by id, retuns error if id not found
     * @param param0 id of bike
     */
    async findCargoBikeById ({ id }:{id: any}) {
        return await this.connection.manager
            .createQueryBuilder()
            .select('cargoBike')
            .from(CargoBike, 'cargoBike')
            .where('cargoBike.id = :id', { id })
            .getOne() || new GraphQLError('ID not found');
    }

    async updateBike ({ id, name }:{id:any, name: string }) {
        const bike = new CargoBike();
        bike.id = id;
        bike.description = 'text';
        bike.name = name;
        await this.connection.manager.save(bike);
        return {
            success: true,
            message: 'bla',
            cargoBike: {
                id,
                name
            }
        };
    }

    /**
     * Updates CargoBike and return updated cargoBike
     * @param param0 cargoBike to be updated
     */
    async updateCargoBike ({ cargoBike }:{ cargoBike: any }) {
        const bike = await this.connection.manager.createQueryBuilder()
            .select('cargoBike')
            .from(CargoBike, 'cargoBike')
            .where('cargoBike.id = :id', { id: cargoBike.id })
            .getOne();
        if (bike) {
            await this.connection
                .createQueryBuilder()
                .update(CargoBike)
                .set({ ...cargoBike })
                .where('id = :id', { id: bike.id })
                .execute();
            return await this.findCargoBikeById({ id: bike.id });
        } else {
            return new GraphQLError('ID not in database');
        }
    }

    /**
     * createCargoBike
     * created CargoBike and returns created bike with new ID
     * @param param0 cargoBike to be created
     */
    async createCargoBike ({ cargoBike }: { cargoBike: any }) {
        const inserts = await this.connection.manager
            .createQueryBuilder()
            .insert()
            .into(CargoBike)
            .values([cargoBike])
            .returning('*')
            .execute();
        const newbike = inserts.generatedMaps[0];
        newbike.id = inserts.identifiers[0].id;
        return newbike;
    }
}
