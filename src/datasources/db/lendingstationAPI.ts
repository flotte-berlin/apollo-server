import { DataSource } from 'apollo-datasource';
import { GraphQLError } from 'graphql';
import { Connection, EntityManager, getConnection } from 'typeorm';
import { CargoBike } from '../../model/CargoBike';
import { LendingStation } from '../../model/LendingStation';
import { TimeFrame } from '../../model/TimeFrame';

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
    async lendingStations (offset: number, limit: number) {
        return await this.connection.getRepository(LendingStation)
            .createQueryBuilder('lendingStation')
            .select()
            .offset(offset)
            .limit(limit)
            .orderBy('name', 'ASC')
            .getMany() || new GraphQLError('Internal Server Error: could not query data from table lendingStation');
    }

    async lendingStationByCargoBikeId (id: number) {
        return await this.connection.getRepository(LendingStation)
            .createQueryBuilder('lendingStation')
            .leftJoinAndSelect('lendingStation.cargoBikes', 'cargoBikes')
            .where('"cargoBikes".id = :id', { id: id })
            .getOne().catch(() => { return null; });
    }

    async timeFrames (offset: number, limit: number) {
        return await this.connection.getRepository(TimeFrame)
            .createQueryBuilder('timeframe')
            .select()
            .offset(offset)
            .limit(limit)
            .getMany() || [];
    }

    async timeFramesByLendingStationId (id: number) {
        return await this.connection.getRepository(TimeFrame)
            .createQueryBuilder('timeFrame')
            .select()
            .where('"timeFrame"."lendingStationId" = :id', { id: id })
            .getMany().catch(() => { return []; });
    }

    async numCargoBikesByLendingStationId (id: number) {
        return await this.connection.getRepository(CargoBike)
            .createQueryBuilder('cargoBike')
            .select()
            .where('"cargoBike"."lendingStationId" = :id', { id: id })
            .getCount();
    }

    async cargoBikesByLendingStationId (id: number) {
        return await this.connection.getRepository(CargoBike)
            .createQueryBuilder('cargoBike')
            .select()
            .where('"cargoBike"."lendingStationId" = :id', { id: id })
            .getMany().catch(() => { return []; });
    }

    /**
     * creates new lendingStation and returns new lendingStation with its new id
     * @param param0 new lendingStation
     */
    async createLendingStation (lendingStation: any) {
        let inserts: any;
        try {
            await this.connection.transaction(async entiyManager => {
                inserts = await entiyManager.createQueryBuilder(LendingStation, 'lendingstation')
                    .insert()
                    .values([lendingStation])
                    .returning('*')
                    .execute();
                await entiyManager.getRepository(LendingStation)
                    .createQueryBuilder('lendingstation')
                    .relation(LendingStation, 'contactPersons')
                    .of(lendingStation.id)
                    .add(lendingStation?.contactPersonIds.map((e: any) => { return Number(e); }));
            });
        } catch (e :any) {
            return new GraphQLError('Transaction could not be completed');
        }
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

    async createTimeFrame (timeFrame: any) {
        let inserts: any;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (timeFrame.to === undefined) {
                timeFrame.to = '';
            }
            timeFrame.dateRange = '[' + timeFrame.from + ',' + timeFrame.to + ')';
            inserts = await entityManager.getRepository(TimeFrame)
                .createQueryBuilder('timeframe')
                .insert()
                .returning('*')
                .values([timeFrame])
                .execute();
            await entityManager.getRepository(TimeFrame)
                .createQueryBuilder()
                .relation(TimeFrame, 'cargoBike')
                .of(inserts.identifiers[0].id)
                .set(timeFrame.cargoBikeId);
            await entityManager.getRepository(TimeFrame)
                .createQueryBuilder()
                .relation(TimeFrame, 'lendingStation')
                .of(inserts.identifiers[0].id)
                .set(timeFrame.lendingStationId);
        });
        inserts.generatedMaps[0].id = inserts.identifiers[0].id;
        return inserts.generatedMaps[0];
    }
}
