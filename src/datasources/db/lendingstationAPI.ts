/*
Copyright (C) 2020  Leon Löchner

This file is part of fLotte-API-Server.

    fLotte-API-Server is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    fLotte-API-Server is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with fLotte-API-Server.  If not, see <https://www.gnu.org/licenses/>.
*/

import { DataSource } from 'apollo-datasource';
import { UserInputError } from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import { Connection, EntityManager, getConnection } from 'typeorm';
import { CargoBike } from '../../model/CargoBike';
import { LendingStation } from '../../model/LendingStation';
import { TimeFrame } from '../../model/TimeFrame';
import { ActionLogger, genDateRange, DBUtils, LockUtils } from './utils';

export class LendingStationAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    async lendingStationById (id:number) {
        return await this.connection.getRepository(LendingStation)
            .createQueryBuilder('ls')
            .select()
            .where('id = :id', { id: id })
            .getOne();
    }

    /**
     * get all lendingStations
     */
    async lendingStations (offset?: number, limit?: number) {
        return await DBUtils.getAllEntity(this.connection, LendingStation, 'ls', offset, limit);
    }

    /**
     * Finds LendingStation of a cargoBike. It will check timeFrames that overlap with today and return these records
     * @param id of cargoBike
     */
    async lendingStationByCargoBikeId (id: number) {
        return await this.connection.getRepository(TimeFrame)
            .createQueryBuilder('tf')
            .relation(TimeFrame, 'lendingStationId')
            .of((await this.connection.getRepository(TimeFrame)// TODO maybe this can be done with a sub query
                .createQueryBuilder('tf')
                .select()
                .where('"cargoBikeId" = :cid', { cid: id })
                .andWhere('"dateRange" && daterange(CURRENT_DATE,CURRENT_DATE,\'[]\')')
                .getOne())?.id)
            .loadOne();
    }

    async lendingStationByTimeFrameId (id: number) {
        return await this.connection.getRepository(LendingStation)
            .createQueryBuilder('lendingStation')
            .relation(TimeFrame, 'lendingStationId')
            .of(id)
            .loadOne();
    }

    async timeFrames (offset?: number, limit?: number) {
        return await DBUtils.getAllEntity(this.connection, TimeFrame, 'tf', offset, limit);
    }

    async timeFramesByCargoBikeId (id: number) {
        return await this.connection.getRepository(CargoBike)
            .createQueryBuilder('cb')
            .relation(CargoBike, 'timeFrames')
            .of(id)
            .loadMany();
    }

    async timeFramesByLendingStationId (id: number) {
        return await this.connection.getRepository(TimeFrame)
            .createQueryBuilder('timeFrame')
            .select()
            .where('"timeFrame"."lendingStationId" = :id', { id: id })
            .getMany().catch(() => { return []; });
    }

    async timeFrameById (id: number) {
        return await this.connection.getRepository(TimeFrame)
            .createQueryBuilder('tf')
            .select()
            .where('id = :id', { id: id })
            .getOne();
    }

    async lockLendingStationById (id: number, uId: number) {
        return await LockUtils.lockEntity(this.connection, LendingStation, 'ls', id, uId);
    }

    unlockLendingStationById (id: number, uId: number) {
        return LockUtils.unlockEntity(this.connection, LendingStation, 'ls', id, uId);
    }

    /**
     * Counts all timeframes with one lendingStation that overlap with today's date
     * @param id of lendingStation
     */
    async numCargoBikesByLendingStationId (id: number) {
        return await this.connection.getRepository(TimeFrame)
            .createQueryBuilder('timeframe')
            .select()
            .where('"timeframe"."lendingStationId" = :id', { id: id })
            .andWhere('"timeframe"."dateRange" && daterange(CURRENT_DATE,CURRENT_DATE,\'[]\')')
            .getCount();
    }

    /**
     * Finds cargoBikes that are currently at the lendingStation specified by id.
     * It checks all timeFrames for that bike and checks whether today is within its timeRange.
     * @param id of lendingStation
     */
    async cargoBikesByLendingStationId (id: number) {
        return await this.connection.getRepository(CargoBike)
            .createQueryBuilder('cargoBike') // .addFrom(TimeFrame, 'timeframe')
            .leftJoinAndSelect('cargoBike.timeFrames', 'timeframes')
            .where('timeframes."lendingStationId" = :id', { id: id })
            .andWhere('timeframes."dateRange" && daterange(CURRENT_DATE,CURRENT_DATE,\'[]\')')
            .printSql()
            .getMany();
    }

    /**
     * creates new lendingStation and returns new lendingStation with its new id
     * @param lendingStation
     */
    async createLendingStation (lendingStation: any) {
        let inserts: any;
        await this.connection.transaction(async entityManager => {
            inserts = await entityManager.createQueryBuilder(LendingStation, 'ls')
                .insert()
                .values([lendingStation])
                .returning('*')
                .execute();
        });
        // when using the return values, the simple array has a different format and must treated in another way, so this is the more expansive solution
        return await this.lendingStationById(inserts?.generatedMaps[0].id);
    }

    /**
     * updates lendingStation and return updated lendingStation
     * @param lendingStation
     * @param userId
     */
    async updateLendingStation (lendingStation: any, userId: number) {
        const keepLock = lendingStation.keepLock;
        delete lendingStation.keepLock;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, LendingStation, 'ls', lendingStation.id, userId)) {
                throw new UserInputError('Attempting to update locked resource');
            }
            await ActionLogger.log(entityManager, LendingStation, 'ls', lendingStation, userId);
            await entityManager.getRepository(LendingStation)
                .createQueryBuilder('ls')
                .update()
                .set({ ...lendingStation })
                .where('id = :id', { id: lendingStation.id })
                .execute();
        });
        !keepLock && await LockUtils.unlockEntity(this.connection, LendingStation, 'ls', lendingStation.id, userId);
        return await this.lendingStationById(lendingStation.id);
    }

    async deleteLendingStationById (id: number, userId: number) {
        return await DBUtils.deleteEntity(this.connection, LendingStation, 'ls', id, userId);
    }

    async createTimeFrame (timeFrame: any) {
        return await this.connection.transaction(async (entityManager: EntityManager) => {
            if (timeFrame.to === undefined) {
                timeFrame.to = '';
            }
            timeFrame.dateRange = '[' + timeFrame.from + ',' + timeFrame.to + ')';
            // checking for overlapping time frames
            const overlapping = await entityManager.getRepository(TimeFrame)
                .createQueryBuilder('timeframe')
                .select([
                    'timeframe.id'
                ])
                .where('timeframe."cargoBikeId" = :id', { id: timeFrame.cargoBikeId })
                .andWhere('timeframe."dateRange" && :tr', { tr: timeFrame.dateRange })
                .getMany();
            if (overlapping.length !== 0) {
                throw new UserInputError('TimeFrames with ids: ' + overlapping.map((e) => { return e.id + ', '; }) + 'are overlapping');
            }
            return await entityManager.getRepository(TimeFrame)
                .createQueryBuilder('timeframe')
                .insert()
                .returning('*')
                .values([timeFrame])
                .execute()
                .then(inserts => {
                    inserts.generatedMaps[0].id = inserts?.identifiers[0].id;
                    return inserts.generatedMaps[0];
                });
        });
    }

    async lockTimeFrame (id: number, userId: number) {
        return await LockUtils.lockEntity(this.connection, TimeFrame, 'tf', id, userId);
    }

    async unlockTimeFrame (id: number, userId: number) {
        return await LockUtils.unlockEntity(this.connection, TimeFrame, 'tf', id, userId);
    }

    async updateTimeFrame (timeFrame: any, userId: number) {
        const keepLock = timeFrame.keepLock;
        delete timeFrame.keepLock;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, TimeFrame, 'tf', timeFrame.id, userId)) {
                throw new UserInputError('Attempting to update locked resource');
            }
            genDateRange(timeFrame);
            await ActionLogger.log(entityManager, TimeFrame, 'tf', timeFrame, userId);

            await entityManager.getRepository(TimeFrame)
                .createQueryBuilder('timeframe')
                .select([
                    'timeframe.id'
                ])
                .where('timeframe."cargoBikeId" = :id', { id: timeFrame.cargoBikeId })
                .andWhere('timeframe."dateRange" && :tr', { tr: timeFrame.dateRange })
                .andWhere('timeFrame.id != :tid', { tid: timeFrame.id })
                .getMany().then(overlapping => {
                    if (overlapping.length !== 0) {
                        throw new UserInputError('TimeFrames with ids: ' + overlapping.map((e) => { return e.id + ', '; }) + 'are overlapping');
                    }
                });
            await entityManager.getRepository(TimeFrame)
                .createQueryBuilder('tf')
                .update()
                .set({ ...timeFrame })
                .where('id = :id', { id: timeFrame.id })
                .execute()
                .then(value => { if (value.affected !== 1) { throw new UserInputError('ID not found'); } });
        });
        !keepLock && await this.unlockTimeFrame(timeFrame.id, userId);
        return this.timeFrameById(timeFrame.id);
    }

    async deleteTimeFrame (id: number, userId: number) {
        return await DBUtils.deleteEntity(this.connection, TimeFrame, 'tf', id, userId);
    }
}
