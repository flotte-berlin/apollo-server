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

    /**
     * Finds cargo bike by id
     */
    async findCargoBikeById ({ id }:{id: any}) {
        return {
            id,
            name: 'token'
        };
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
     * Creates or Updates CargoBike
     * Will create bike, if no id given, else it will update bike with given id.
     * @param param0 cargoBike to be updated or created
     */
    async updateCargoBike ({ cargoBike }:{ cargoBike: any }) {
        if (cargoBike.id) {
            // update bike with given id
            const bike = await this.connection.manager.createQueryBuilder()
                .select('cargoBike')
                .from(CargoBike, 'cargoBike')
                .where('cargoBike.id = :id', { id: cargoBike.id })
                .getOne();
            if (bike) {
                // bike exists
                await this.connection
                    .createQueryBuilder()
                    .update(CargoBike)
                    .set({ ...cargoBike })
                    .where('id = :id', { id: bike.id })
                    .execute();
                return await this.connection
                    .createQueryBuilder()
                    .select('cargoBike')
                    .from(CargoBike, 'cargoBike')
                    .where('cargoBike.id = :id', { id: bike.id })
                    .getOne();
            } else {
                return new GraphQLError('ID not in database');
            }
        } else {
            // create new bike
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
}
