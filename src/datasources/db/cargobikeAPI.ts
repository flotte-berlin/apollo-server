import { DataSource } from 'apollo-datasource'

/**
 * extended datasource to feed resolvers with data about cargoBikes
 */
export class CargoBikeAPI extends DataSource {
    /**
     * Finds cargo bike by id
     */
    async findCargoBikeById ({ id, token }:{id: any, token:string}) {
        return {
            id,
            name: token
        }
    }
}
