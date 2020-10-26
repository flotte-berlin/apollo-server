import { DataSource } from 'apollo-datasource';
import { getConnection, Connection, ObjectType, EntityManager } from 'typeorm';
import { CargoBike, Lockable } from '../../model/CargoBike';
import { GraphQLError } from 'graphql';
import { BikeEvent } from '../../model/BikeEvent';
import { Equipment } from '../../model/Equipment';
import { Engagement } from '../../model/Engagement';
import { Provider } from '../../model/Provider';
import { TimeFrame } from '../../model/TimeFrame';
import { ActionLogger, LockUtils } from './utils';
import { EquipmentType } from '../../model/EquipmentType';
import { BikeEventType } from '../../model/BikeEventType';

/**
 * extended datasource to feed resolvers with data about cargoBikes
 */
export class CargoBikeAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    async getCargoBikes (offset: number, limit: number) {
        return await this.connection.createQueryBuilder()
            .select('cargoBike')
            .from(CargoBike, 'cargoBike')
            .orderBy('name', 'ASC')
            .offset(offset)
            .limit(limit)
            .getMany();
    }

    /**
     * Finds cargo bike by id, returns null if id was not found
     * @param param0 id of bike
     */
    async findCargoBikeById (id: number) {
        return await this.connection.getRepository(CargoBike)
            .createQueryBuilder('cargobike')
            .select()
            .where('cargobike.id = :id', { id })
            .getOne();
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

    /**
     * Updates CargoBike and return updated cargoBike
     * @param param0 cargoBike to be updated
     */
    async updateCargoBike (cargoBike: any, userId:number) {
        const keepLock = cargoBike?.keepLock;
        delete cargoBike.keepLock;
        delete cargoBike.lendingStationId;
        let equipmentTypeIds: any = null;
        if (cargoBike.equipmentTypeIds) {
            equipmentTypeIds = cargoBike.equipmentTypeIds;
            delete cargoBike.equipmentTypeIds;
        }
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, CargoBike, 'cb', cargoBike.id, userId)) {
                throw new GraphQLError('CargoBike locked by other user');
            }
            await ActionLogger.log(entityManager, CargoBike, 'cb', cargoBike, userId);
            await entityManager.getRepository(CargoBike)
                .createQueryBuilder('cargobike')
                .update()
                .set({ ...cargoBike })
                .where('id = :id', { id: cargoBike.id })
                .execute();
            equipmentTypeIds && await entityManager.getRepository(CargoBike)
                .createQueryBuilder('cargobike')
                .relation(CargoBike, 'equipmentTypeIds')
                .of(cargoBike.id)
                .addAndRemove(equipmentTypeIds, await this.equipmentTypeByCargoBikeId(cargoBike.id)); // TODO remove all existing relations
        });
        !keepLock && await LockUtils.unlockEntity(this.connection, CargoBike, 'cb', cargoBike.id, userId);
        return await this.findCargoBikeById(cargoBike.id);
    }

    /**
     * createCargoBike
     * created CargoBike and returns created bike with new ID
     * @param param0 cargoBike to be created
     */
    async createCargoBike ({ cargoBike }: { cargoBike: any }) {
        let inserts: any;
        await this.connection.transaction(async (entityManager:any) => {
            inserts = await entityManager.getRepository(CargoBike)
                .createQueryBuilder('cargobike')
                .insert()
                .values([cargoBike])
                .returning('*')
                .execute();
            cargoBike?.equipmentTypeIds && await entityManager.getRepository(CargoBike)
                .createQueryBuilder('cargobike')
                .relation(CargoBike, 'equipmentTypeIds')
                .of(inserts.identifiers[0].id)
                .add(cargoBike.equipmentTypeIds);
        });
        const newbike = inserts.generatedMaps[0];
        newbike.id = inserts.identifiers[0].id;
        return newbike;
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
                throw new GraphQLError('BikeEvent locked by other user');
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

    async bikeEventsByCargoBikeId (id: number, offset: number = 0, limit:number = 100) {
        return await this.connection.getRepository(CargoBike)
            .createQueryBuilder('cb')
            .skip(offset)
            .take(limit)
            .relation(CargoBike, 'bikeEvents')
            .of(id)
            .loadMany();
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
                throw new GraphQLError('BikeEventType locked by other user');
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

    async bikeEventTypes (offset: number, limit: number) {
        return await this.connection.getRepository(BikeEventType)
            .createQueryBuilder('bet')
            .select()
            .skip(offset)
            .take(limit)
            .getMany();
    }

    async bikeEvents (offset: number, limit: number) {
        return await this.connection.getRepository(BikeEvent)
            .createQueryBuilder('be')
            .select()
            .skip(offset)
            .take(limit)
            .getMany();
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

    async checkId (target: ObjectType<Lockable>, alias: string, id: number) {
        const result = await this.connection.getRepository(target)
            .createQueryBuilder(alias)
            .select([
                alias + '.id'
            ])
            .where('id = :id', { id: id })
            .getCount();
        return result === 1;
    }

    /**
     * Returns equipment of one cargoBike
     * @param offset
     * @param limit
     * @param id
     */
    async equipmentByCargoBikeId (offset: number, limit: number, id: number) {
        return await this.connection.getRepository(Equipment)
            .createQueryBuilder('equipment')
            .select()
            .where('equipment."cargoBikeId" = :id', { id: id })
            .getMany();
    }

    async createEquipment ({ equipment }: { equipment: any }) {
        const inserts = await this.connection.getRepository(Equipment)
            .createQueryBuilder('equipment')
            .insert()
            .into(Equipment)
            .values([equipment])
            .returning('*')
            .execute();
        return this.equipmentById(inserts.identifiers[0].id);
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
     * @param param0 struct with equipment properites
     */
    async updateEquipment (equipment: any, userId: number) {
        const keepLock = equipment.keepLock;
        delete equipment.keepLock;
        // const cargoBikeId = equipment.cargoBikeId;
        // delete equipment.cargoBikeId;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, Equipment, 'equipment', equipment.id, userId)) {
                return new GraphQLError('Equipment is locked by other user');
            }
            await ActionLogger.log(entityManager, Equipment, 'e', equipment, userId);
            await entityManager.getRepository(Equipment)
                .createQueryBuilder('equipment')
                .update()
                .set({ ...equipment })
                .where('id = :id', { id: equipment.id })
                .execute();
            /* if (cargoBikeId || cargoBikeId === null) {
                await this.connection.getRepository(Equipment)
                    .createQueryBuilder()
                    .relation(Equipment, 'cargoBike')
                    .of(equipment.id)
                    .set(cargoBikeId);
            }

             */
        }
        );
        !keepLock && await LockUtils.unlockEntity(this.connection, Equipment, 'e', equipment.id, userId);
        return this.equipmentById(equipment.id);
    }

    async getEquipment (offset: number, limit: number) {
        return await this.connection.getRepository(Equipment)
            .createQueryBuilder('equipment')
            .leftJoinAndSelect('equipment.cargoBike', 'cargoBike')
            .orderBy('title', 'ASC')
            .offset(offset)
            .limit(limit)
            .getMany();
    }

    async createEquipmentType (equipmentType: any) {
        const inserts = await this.connection.getRepository(EquipmentType)
            .createQueryBuilder('equipment')
            .insert()
            .values([equipmentType])
            .returning('*')
            .execute();
        inserts.generatedMaps[0].id = inserts.identifiers[0].id;
        return inserts.generatedMaps[0];
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
                throw new GraphQLError('EquipmentType is locked by other user');
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

    async equipmentTypeById (id: number) {
        return await this.connection.getRepository(EquipmentType)
            .createQueryBuilder('equipmentType')
            .select()
            .where('"equipmentType".id = :id', { id: id })
            .getOne();
    }

    async equipmentTypes (offset: number, limit: number) {
        return await this.connection.getRepository(EquipmentType)
            .createQueryBuilder('et')
            .select()
            .skip(offset)
            .take(limit)
            .getMany();
    }

    async equipmentTypeByCargoBikeId (id: number) {
        return await this.connection.getRepository(CargoBike)
            .createQueryBuilder('cargobike')
            .relation(CargoBike, 'equipmentTypeIds')
            .of(id)
            .loadMany();
    }
}
