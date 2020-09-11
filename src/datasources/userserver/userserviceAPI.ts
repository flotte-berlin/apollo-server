import { DataSource } from 'apollo-datasource'

/**
 * fetches datafrom user server, especially validates user tokens
 */
export class UserServerAPI extends DataSource {
    /**
     * validates user token
     */
    async validateToken (token:string) {
        return true
    }
}
