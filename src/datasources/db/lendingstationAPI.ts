import { DataSource } from 'apollo-datasource';
import { Connection, getConnection } from 'typeorm';

export class LendingStationAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    async updateLendingStation ({ lendingStation }:{ lendingStation: any }) {
        return lendingStation;
    }
}
