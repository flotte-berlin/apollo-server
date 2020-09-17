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

    async getLendingStationById ({ id }: { id: any }) {
        return await this.connection.manager
            .createQueryBuilder()
            .select('lendingStation')
            .from(LendingStation, 'lendingStation')
            .where('lendingStation.id = :id', { id: id })
            .getOne();
    }

    /**
     * get all lendingStations
     */
    async getLendingStations () {
        return await this.connection.manager
            .createQueryBuilder()
            .select('lendingStation')
            .from(LendingStation, 'lendingStation')
            .getMany() || new GraphQLError('Internal Server Error: could not query data from table lendingStation');
    }

    /**
     * creates new lendingStation and returns new lendingStation with its new id
     * @param param0 new lendingStation
     */
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

    /**
     * updates lendingStation and return updated lendingStation
     * @param param0 lendingStation to be updated
     */
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
            return this.getLendingStationById({ id: lendingStation.id });
        } else {
            return new GraphQLError('ID not in database');
        }
    }
}
