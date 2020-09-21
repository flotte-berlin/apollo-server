import { DataSource } from 'apollo-datasource';
import { Connection, getConnection } from 'typeorm';

export class ParticipantAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    async getParticipantById (id: number) {
        return {
            id: 2
        };
    }

    async engagementByParticipantId (id: number) {
        return {
            id: 3
        };
    }
}
