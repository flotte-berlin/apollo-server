import { DataSource } from 'apollo-datasource';
import { GraphQLError } from 'graphql';
import { Connection, getConnection } from 'typeorm';
import { LendingStation } from '../../model/LendingStation';

export class LendingStationAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    async createLendingStation ({ lendingStation }:{ lendingStation: any }) {
        console.log(lendingStation);
        const inserts = await this.connection.manager
            .createQueryBuilder()
            .insert()
            .into(LendingStation)
            .values([lendingStation])
            .returning('*')
            .execute();
        const newLendingStaion = inserts.generatedMaps[0];
        newLendingStaion.id = inserts.identifiers[0].id;
        return newLendingStaion;
    }

    async updateLendingStation ({ lendingStation }:{ lendingStation: any }) {
        const oldLendingStation = await this.connection.manager.createQueryBuilder()
            .select('lendingStation')
            .from(LendingStation, 'lendingStation')
            .where('lendingStation.id = :id', { id: lendingStation.id })
            .getOne();
        if (oldLendingStation) {
            await this.connection
                .createQueryBuilder()
                .update(LendingStation)
                .set({ ...lendingStation })
                .where('id = :id', { id: lendingStation.id })
                .execute();
            return await this.connection
                .createQueryBuilder()
                .select('lendingStation')
                .from(LendingStation, 'lendingStation')
                .where('lendingStation.id = :id', { id: lendingStation.id })
                .getOne();
        } else {
            return new GraphQLError('ID not in database');
        }
    }
}
