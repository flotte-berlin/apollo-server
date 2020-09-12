import { DataSource } from 'apollo-datasource'
import { getConnection, Connection } from 'typeorm'
import { CargoBike } from '../../model/CargoBike'
/**
 * extended datasource to feed resolvers with data about cargoBikes
 */
export class CargoBikeAPI extends DataSource {
    connection : Connection
    constructor () {
        super()
        this.connection = getConnection()
    }

    /**
     * Finds cargo bike by id
     */
    async findCargoBikeById ({ id, token }:{id: any, token:string}) {
        return {
            id,
            name: token
        }
    }

    async updateBike ({ id, token, name }:{id:any, token: string, name: string }) {
        const bike = new CargoBike()
        bike.id = id
        bike.description = token
        bike.name = name
        await this.connection.manager.save(bike)
        return {
            success: true,
            message: token,
            bike: {
                id,
                name
            }
        }
    }
}
