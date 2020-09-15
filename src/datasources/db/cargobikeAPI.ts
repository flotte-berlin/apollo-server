import { DataSource } from 'apollo-datasource';
import { getConnection, Connection } from 'typeorm';
import { CargoBike } from '../../model/CargoBike';
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
            bike: {
                id,
                name
            }
        };
    }
}
