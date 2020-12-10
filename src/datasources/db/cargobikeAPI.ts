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
import { ApolloError } from 'apollo-server-express';
import { Connection, EntityManager, getConnection } from 'typeorm';
import { CargoBike } from '../../model/CargoBike';
import { BikeEvent } from '../../model/BikeEvent';
import { Equipment } from '../../model/Equipment';
import { Engagement } from '../../model/Engagement';
import { Provider } from '../../model/Provider';
import { TimeFrame } from '../../model/TimeFrame';
import { ActionLogger, DBUtils, genBoxDimensions, LockUtils } from './utils';
import { EquipmentType } from '../../model/EquipmentType';
import { BikeEventType } from '../../model/BikeEventType';
import { Actions } from '../../model/ActionLog';
import { ResourceLockedError } from '../../errors/ResourceLockedError';
import { NotFoundError } from '../../errors/NotFoundError';
import { CopyConfig } from '../../model/CopyConfig';

/**
 * extended datasource to feed resolvers with data about cargoBikes
 */
export class CargoBikeAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    private async addCopyConfig (key: string, value: boolean) {
        return await this.connection.getRepository(CopyConfig)
            .createQueryBuilder('cc')
            .insert()
            .values([{ key, value }])
            .execute();
    }

    /**
     * populate CopyConfig with default values
     */
    async populateCopyConfig () {
        if (await this.connection.getRepository(CopyConfig)
            .createQueryBuilder('cc')
            .select()
            .getCount() === 0) {
            const config: CopyConfig[] = [
                { key: 'id', value: false },
                { key: 'group', value: true },
                { key: 'name', value: true },
                { key: 'state', value: true },
                { key: 'equipmentIds', value: false },
                { key: 'equipmentTypeIds', value: false },
                { key: 'security', value: false },
                { key: 'stickerBikeNameState', value: true },
                { key: 'note', value: true },
                { key: 'providerId', value: false },
                { key: 'bikeEvents', value: false },
                { key: 'insuranceData', value: true },
                { key: 'timeFrames', value: false },
                { key: 'engagement', value: false },
                { key: 'taxes', value: true },
                { key: 'description', value: true },
                { key: 'modelName', value: true },
                { key: 'numberOfWheels', value: true },
                { key: 'forCargo', value: true },
                { key: 'forChildren', value: true },
                { key: 'numberOfChildren', value: true },
                { key: 'technicalEquipment', value: true },
                { key: 'dimensionsAndLoad', value: true }
            ];
            await this.connection.getRepository(CopyConfig)
                .createQueryBuilder('cc')
                .insert()
                .values(config)
                .execute();
        }
    }

    async getCargoBikes (offset?: number, limit?: number) {
        return await DBUtils.getAllEntity(this.connection, CargoBike, 'cb', offset, limit);
    }

    /**
     * Finds cargo bike by id, returns null if id was not found
     * @param id
     */
    async findCargoBikeById (id: number) : Promise<CargoBike> {
        return await this.connection.getRepository(CargoBike)
            .createQueryBuilder('cb')
            .select()
            .where('id = :id', { id })
            .getOne().catch(() => {
                throw new NotFoundError('CargoBike', 'id', id);
            });
    }

    async findCargoBikeByEngagementId (id: number) {
        return await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .relation(Engagement, 'cargoBikeId')
            .of(id)
            .loadOne();
    }

    async cargoBikesByProviderId (id: number) {
        return await this.connection
            .createQueryBuilder()
            .relation(Provider, 'cargoBikeIds')
            .of(id)
            .loadMany();
    }

    async cargoBikeByTimeFrameId (id: number) {
        return await this.connection.getRepository(TimeFrame)
            .createQueryBuilder('timeframe')
            .relation(TimeFrame, 'cargoBikeId')
            .of(id)
            .loadOne();
    }

    async lockCargoBike (id: number, userId: number) {
        if (!await this.connection.getRepository(CargoBike).findOne(id)) {
            throw new NotFoundError('CargoBike', 'id', id);
        }
        return await LockUtils.lockEntity(this.connection, CargoBike, 'cb', id, userId);
    }

    async unlockCargoBike (id: number, userId: number) {
        if (!await this.connection.getRepository(CargoBike).findOne(id)) {
            throw new NotFoundError('CargoBike', 'id', id);
        }
        return await LockUtils.unlockEntity(this.connection, CargoBike, 'cb', id, userId);
    }

    /**
     * Updates CargoBike and return updated cargoBike
     * @param cargoBike
     * @param userId
     */
    async updateCargoBike (cargoBike: any, userId:number) {
        const keepLock = cargoBike?.keepLock;
        delete cargoBike.keepLock;
        const equipmentTypeIds = cargoBike?.equipmentTypeIds;
        delete cargoBike?.equipmentTypeIds;
        const equipmentIds = cargoBike?.equipmentIds;
        delete cargoBike?.equipmentIds;
        // generate ranges for box dimensions
        genBoxDimensions(cargoBike);

        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, CargoBike, 'cb', cargoBike.id, userId)) {
                throw new ResourceLockedError('CargoBike');
            }
            await ActionLogger.log(entityManager, CargoBike, 'cb', cargoBike, userId);
            await entityManager.getRepository(CargoBike)
                .createQueryBuilder('cb')
                .update()
                .set({ ...cargoBike })
                .where('id = :id', { id: cargoBike.id })
                .execute();

            equipmentTypeIds && await entityManager.getRepository(CargoBike)
                .createQueryBuilder('cb')
                .relation(CargoBike, 'equipmentTypeIds')
                .of(cargoBike.id)
                .addAndRemove(equipmentTypeIds, await this.equipmentTypeByCargoBikeId(cargoBike.id));

            equipmentIds && await entityManager.getRepository(CargoBike)
                .createQueryBuilder('cb')
                .relation(CargoBike, 'equipmentIds')
                .of(cargoBike.id)
                .addAndRemove(equipmentIds, await this.equipmentByCargoBikeId(cargoBike.id));
        });
        !keepLock && await LockUtils.unlockEntity(this.connection, CargoBike, 'cb', cargoBike.id, userId);
        return await this.findCargoBikeById(cargoBike.id);
    }

    async deleteCargoBike (id: number, userId: number) {
        return await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, CargoBike, 'cb', id, userId)) {
                throw new ResourceLockedError('CargoBike', 'Attempting to soft delete locked resource');
            }
            await ActionLogger.log(entityManager, CargoBike, 'bg', { id: id }, userId, Actions.SOFT_DELETE);
            return await entityManager.getRepository(CargoBike)
                .createQueryBuilder('cb')
                .delete()
                .where('id = :id', { id: id })
                .execute();
        }).then(value => value.affected === 1);
    }

    /**
     * createCargoBike
     * created CargoBike and returns created bike with new ID
     * @param param0 cargoBike to be created
     */
    async createCargoBike (cargoBike: any) {
        let inserts: any = {};
        genBoxDimensions(cargoBike);
        await this.connection.transaction(async (entityManager:any) => {
            inserts = await entityManager.getRepository(CargoBike)
                .createQueryBuilder('cb')
                .insert()
                .values([cargoBike])
                .returning('*')
                .execute();
            cargoBike?.equipmentTypeIds && await entityManager.getRepository(CargoBike)
                .createQueryBuilder('cb')
                .relation(CargoBike, 'equipmentTypeIds')
                .of(inserts.identifiers[0].id)
                .add(cargoBike.equipmentTypeIds);
            cargoBike?.equipmentIds && await entityManager.getRepository(CargoBike)
                .createQueryBuilder('cb')
                .relation(CargoBike, 'equipmentIds')
                .of(inserts.identifiers[0].id)
                .add(cargoBike.equipmentIds);
        });
        inserts.generatedMaps[0].id = inserts?.identifiers[0].id;
        return inserts?.generatedMaps[0];
    }

    async createBikeEvent ({ bikeEvent }: { bikeEvent: any }) {
        return (await this.connection.getRepository(BikeEvent)
            .createQueryBuilder('be')
            .insert()
            .values([bikeEvent])
            .returning('*')
            .execute()).generatedMaps[0];
    }

    async updateBikeEvent (bikeEvent: any, userId: number) {
        const keepLock = bikeEvent.keepLock;
        delete bikeEvent.keepLock;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, BikeEvent, 'be', bikeEvent.id, userId)) {
                throw new ResourceLockedError('BikeEvents');
            }
            await ActionLogger.log(entityManager, BikeEvent, 'be', bikeEvent, userId);
            await entityManager.getRepository(BikeEvent)
                .createQueryBuilder('be')
                .update()
                .set({ ...bikeEvent })
                .where('id = :id', { id: bikeEvent.id })
                .execute();
        });
        !keepLock && await LockUtils.unlockEntity(this.connection, BikeEvent, 'be', bikeEvent.id, userId);
        return await this.bikeEventById(bikeEvent.id);
    }

    async deleteBikeEventType (id: number, userId: number) {
        return await DBUtils.deleteEntity(this.connection, BikeEventType, 'bet', id, userId);
    }

    async deleteBikeEvent (id: number, userId: number) {
        return await DBUtils.deleteEntity(this.connection, BikeEvent, 'be', id, userId);
    }

    async cargoBikeByEventId (id: number) {
        return await this.connection.getRepository(BikeEvent)
            .createQueryBuilder('be')
            .relation(BikeEvent, 'cargoBikeId')
            .of(id)
            .loadOne();
    }

    async bikeEventTypeByBikeEventId (id: number) {
        return await this.connection.getRepository(BikeEvent)
            .createQueryBuilder('be')
            .relation(BikeEvent, 'bikeEventTypeId')
            .of(id)
            .loadOne();
    }

    async bikeEventsByCargoBikeId (id: number, offset?: number, limit?: number) {
        if (offset === null || limit === null) {
            return await this.connection.getRepository(CargoBike)
                .createQueryBuilder('cb')
                .relation(CargoBike, 'bikeEvents')
                .of(id)
                .loadMany();
        } else {
            return await this.connection.getRepository(CargoBike)
                .createQueryBuilder('cb')
                .skip(offset)
                .take(limit)
                .relation(CargoBike, 'bikeEvents')
                .of(id)
                .loadMany();
        }
    }

    async createBikeEventType (bikeEventType: any) {
        return (await this.connection.getRepository(BikeEventType)
            .createQueryBuilder('bet')
            .insert()
            .values([{ name: bikeEventType }])
            .returning('*')
            .execute())?.generatedMaps[0];
    }

    async lockBikeEventType (id: number, userId: number) {
        return await LockUtils.lockEntity(this.connection, BikeEventType, 'bet', id, userId);
    }

    async unlockBikeEventType (id: number, userId: number) {
        return await LockUtils.unlockEntity(this.connection, BikeEventType, 'bet', id, userId);
    }

    async updateBikeEventType (bikeEventType: any, userId: number) {
        const keepLock = bikeEventType.keepLock;
        delete bikeEventType.keepLock;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, BikeEventType, 'bet', bikeEventType.id, userId)) {
                throw new ResourceLockedError('BikeEventType');
            }
            await ActionLogger.log(entityManager, BikeEventType, 'bet', bikeEventType, userId);
            await entityManager.getRepository(BikeEventType)
                .createQueryBuilder('bet')
                .update()
                .set({ ...bikeEventType })
                .where('id = :id', { id: bikeEventType.id })
                .execute();
        });
        !keepLock && await LockUtils.unlockEntity(this.connection, BikeEventType, 'bet', bikeEventType.id, userId);
        return await this.bikeEventTypeById(bikeEventType.id);
    }

    async bikeEventTypes (offset?: number, limit?: number) {
        return await DBUtils.getAllEntity(this.connection, BikeEventType, 'bet', offset, limit);
    }

    async bikeEvents (offset?: number, limit?: number) {
        return await DBUtils.getAllEntity(this.connection, BikeEvent, 'be', offset, limit);
    }

    async bikeEventTypeById (id: number) {
        return await this.connection.getRepository(BikeEventType)
            .createQueryBuilder('bet')
            .select()
            .where('id = :id', { id: id })
            .getOne();
    }

    async responsibleByBikeEventId (id: number) {
        return await this.connection.getRepository(BikeEvent)
            .createQueryBuilder('be')
            .relation(BikeEvent, 'responsibleId')
            .of(id)
            .loadOne();
    }

    async relatedByBikeEventId (id: number) {
        return await this.connection.getRepository(BikeEvent)
            .createQueryBuilder('be')
            .relation(BikeEvent, 'relatedId')
            .of(id)
            .loadOne();
    }

    /**
     * return bikeEvent including CargoBike
     * @param id of event
     */
    async bikeEventById (id: number) {
        return await this.connection.getRepository(BikeEvent)
            .createQueryBuilder('bikeEvent')
            .select()
            .where('id = :id', { id: id })
            .getOne();
    }

    async lockBikeEvent (id: number, userId: number) {
        return await LockUtils.lockEntity(this.connection, BikeEvent, 'be', id, userId);
    }

    async unlockBikeEvent (id: number, userId: number) {
        return await LockUtils.unlockEntity(this.connection, BikeEvent, 'be', id, userId);
    }

    async equipmentById (id: number) {
        return await this.connection.getRepository(Equipment)
            .createQueryBuilder('equipment')
            .select()
            .where('equipment.id = :id', { id: id })
            .getOne();
    }

    /**
     * Returns equipment of one cargoBike
     * @param offset
     * @param limit
     * @param id
     */
    async equipmentByCargoBikeId (id: number, offset?: number, limit?: number) {
        if (offset == null || limit === null) {
            return await this.connection.getRepository(Equipment)
                .createQueryBuilder('equipment')
                .select()
                .where('equipment."cargoBikeId" = :id', { id: id })
                .getMany();
        } else {
            return await this.connection.getRepository(Equipment)
                .createQueryBuilder('equipment')
                .select()
                .where('equipment."cargoBikeId" = :id', { id: id })
                .skip(offset)
                .take(limit)
                .getMany();
        }
    }

    async createEquipment ({ equipment }: { equipment: any }) {
        return await this.connection.getRepository(Equipment)
            .createQueryBuilder('equipment')
            .insert()
            .into(Equipment)
            .values([equipment])
            .returning('*')
            .execute()
            .then(async inserts => {
                return await this.equipmentById(inserts.identifiers[0].id);
            });
    }

    async cargoBikeByEquipmentId (id: number) {
        return await this.connection.getRepository(Equipment)
            .createQueryBuilder('equipment')
            .relation(Equipment, 'cargoBikeId')
            .of(id)
            .loadOne();
    }

    async lockEquipment (id: number, userId: number) {
        return LockUtils.lockEntity(this.connection, Equipment, 'e', id, userId);
    }

    async unlockEquipment (id: number, userId: number) {
        return await LockUtils.unlockEntity(this.connection, Equipment, 'equipment', id, userId);
    }

    /**
     * Will update Equipment, crashes when id not in db or cargoBikeId not db.
     * Will return updated Equipment joined with CargoBike only if cargoBike is was set in param0
     * @param equipment
     * @param userId
     */
    async updateEquipment (equipment: any, userId: number) {
        const keepLock = equipment.keepLock;
        delete equipment.keepLock;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, Equipment, 'equipment', equipment.id, userId)) {
                throw new ResourceLockedError('Equipment');
            }
            await ActionLogger.log(entityManager, Equipment, 'e', equipment, userId);
            await entityManager.getRepository(Equipment)
                .createQueryBuilder('equipment')
                .update()
                .set({ ...equipment })
                .where('id = :id', { id: equipment.id })
                .execute();
        });
        !keepLock && await LockUtils.unlockEntity(this.connection, Equipment, 'e', equipment.id, userId);
        return this.equipmentById(equipment.id);
    }

    async deleteEquipment (id: number, userId: number) {
        return await DBUtils.deleteEntity(this.connection, Equipment, 'e', id, userId);
    }

    async getEquipment (offset?: number, limit?: number) {
        return await DBUtils.getAllEntity(this.connection, Equipment, 'e', offset, limit);
    }

    async createEquipmentType (equipmentType: any) {
        return await this.connection.getRepository(EquipmentType)
            .createQueryBuilder('equipment')
            .insert()
            .values([equipmentType])
            .returning('*')
            .execute()
            .then(inserts => {
                inserts.generatedMaps[0].id = inserts.identifiers[0].id;
                return inserts.generatedMaps[0];
            });
    }

    async lockEquipmentType (id: number, userId : number) {
        return await LockUtils.lockEntity(this.connection, EquipmentType, 'et', id, userId);
    }

    async unlockEquipmentType (id: number, userId : number) {
        return await LockUtils.unlockEntity(this.connection, EquipmentType, 'et', id, userId);
    }

    async updateEquipmentType (equipmentType: any, userId: number) {
        const keepLock = equipmentType.keepLock;
        delete equipmentType.keepLock;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, EquipmentType, 'et', equipmentType.id, userId)) {
                throw new ResourceLockedError('EquipmentType');
            }
            await ActionLogger.log(entityManager, EquipmentType, 'et', equipmentType, userId);
            await entityManager.getRepository(EquipmentType)
                .createQueryBuilder('et')
                .update()
                .set({ ...equipmentType })
                .where('id = :id', { id: equipmentType.id })
                .execute();
        });
        !keepLock && await this.unlockEquipmentType(equipmentType.id, userId);
        return await this.equipmentTypeById(equipmentType.id);
    }

    async deleteEquipmentType (id:number, userId: number) {
        return await DBUtils.deleteEntity(this.connection, EquipmentType, 'et', id, userId);
    }

    async equipmentTypeById (id: number) {
        return await this.connection.getRepository(EquipmentType)
            .createQueryBuilder('equipmentType')
            .select()
            .where('"equipmentType".id = :id', { id: id })
            .getOne();
    }

    async equipmentTypes (offset?: number, limit?: number) {
        return await DBUtils.getAllEntity(this.connection, EquipmentType, 'et', offset, limit);
    }

    async equipmentTypeByCargoBikeId (id: number) {
        return await this.connection.getRepository(CargoBike)
            .createQueryBuilder('cb')
            .relation(CargoBike, 'equipmentTypeIds')
            .of(id)
            .loadMany();
    }

    async copyCargoBikeById (id: number) {
        // load keys
        const keys = await this.connection.getRepository(CopyConfig)
            .createQueryBuilder('cc')
            .select()
            .getMany();
        const cargoBike: any = await this.findCargoBikeById(id);
        keys.forEach(value => {
            if (value.value === false && value.key !== 'id') {
                delete cargoBike[value.key];
            }
        });
        return cargoBike;
    }

    async editCopyConfig (key: string, value: boolean) : Promise<boolean> {
        return await this.connection.getRepository(CopyConfig)
            .createQueryBuilder('cc')
            .update()
            .set({ value: value })
            .where('key = :key', { key: key })
            .returning('*')
            .execute().then((v) => {
                if (v.affected !== 1) {
                    throw new NotFoundError('CopyConfig', 'key', key);
                } else {
                    return true;
                }
            },
            (e) => {
                throw new ApolloError(e);
            });
    }
}
