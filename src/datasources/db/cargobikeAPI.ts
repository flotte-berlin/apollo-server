import { DataSource } from 'apollo-datasource';
import { getConnection, Connection, ObjectType, EntityManager } from 'typeorm';
import { CargoBike, Lockable } from '../../model/CargoBike';
import { GraphQLError } from 'graphql';
import { BikeEvent } from '../../model/BikeEvent';
import { Equipment } from '../../model/Equipment';
import { Engagement } from '../../model/Engagement';
import { Provider } from '../../model/Provider';
import { TimeFrame } from '../../model/TimeFrame';
import { LockUtils } from './utils';
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
            .relation(Provider, 'cargoBikes')
            .of(id)
            .loadMany();
    }

    async cargoBikeByTimeFrameId (id: number) {
        return await this.connection.getRepository(TimeFrame)
            .createQueryBuilder('timeframe')
            .relation(TimeFrame, 'cargoBike')
            .of(id)
            .loadOne();
    }

    /**
     * Updates CargoBike and return updated cargoBike
     * @param param0 cargoBike to be updated
     */
    async updateCargoBike (cargoBike: any, userId:number) {
        // TODO lock cargoBike can return error to save one sql query, this will be a complex sql query
        if (!await this.checkId(CargoBike, 'cargobike', cargoBike.id)) {
            return new GraphQLError('ID not found');
        }
        if (!await LockUtils.lockEntity(this.connection, CargoBike, 'cb', cargoBike.id, userId)) {
            return new GraphQLError('Bike locked by other user');
        }
        const keepLock = cargoBike?.keepLock;
        delete cargoBike.keepLock;
        delete cargoBike.lendingStationId;
        let equipmentTypeIds: any = null;
        if (cargoBike.equipmentTypeIds) {
            equipmentTypeIds = cargoBike.equipmentTypeIds;
            delete cargoBike.equipmentTypeIds;
        }
        await this.connection.transaction(async (entityManager: EntityManager) => {
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
            await entityManager.getRepository(CargoBike)
                .createQueryBuilder('cargobike')
                .relation(CargoBike, 'provider')
                .of(inserts.identifiers[0].id)
                .set(cargoBike?.providerId);
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

    async findBikeEventTypeById (id: number) {
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
    async findBikeEventById (id: number) {
        return await this.connection.getRepository(BikeEvent)
            .createQueryBuilder('bikeEvent')
            .leftJoinAndSelect('bikeEvent.cargoBike', 'cargoBike')
            .where('bikeEvent.id = :id', { id: id })
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
        if (equipment.cargoBikeId) {
            await this.connection
                .createQueryBuilder()
                .relation(Equipment, 'cargoBike')
                .of(equipment.id)
                .set(equipment.cargoBikeId);
        }
        return this.equipmentById(inserts.identifiers[0].id);
    }

    async cargoBikeByEquipmentId (id: number) {
        return (await this.connection.getRepository(Equipment)
            .createQueryBuilder('equipment')
            .leftJoinAndSelect('equipment.cargoBike', 'cargoBike')
            .where('equipment.id = :id', { id: id })
            .getOne())?.cargoBike;
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
        // TODO let lock cargoBike can return error to save one sql query, this will be a complex sql query
        if (!await this.checkId(Equipment, 'alias', equipment.id)) {
            return new GraphQLError('ID not found in DB');
        }
        if (!await LockUtils.lockEntity(this.connection, Equipment, 'equipment', equipment.id, userId)) {
            return new GraphQLError('Equipment locked by other user');
        }
        const keepLock = equipment.keepLock;
        delete equipment.keepLock;
        const cargoBikeId = equipment.cargoBikeId;
        delete equipment.cargoBikeId;
        await this.connection.getRepository(Equipment)
            .createQueryBuilder('equipment')
            .update()
            .set({ ...equipment })
            .where('id = :id', { id: equipment.id })
            .returning('*')
            .execute();
        if (cargoBikeId || cargoBikeId === null) {
            await this.connection.getRepository(Equipment)
                .createQueryBuilder()
                .relation(Equipment, 'cargoBike')
                .of(equipment.id)
                .set(cargoBikeId);
            !keepLock && LockUtils.unlockEntity(this.connection, Equipment, 'e', equipment.id, userId);
            return this.equipmentById(equipment.id);
        }
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

    async equipmentTypeById (id: number) {
        return await this.connection.getRepository(EquipmentType)
            .createQueryBuilder('equipmentType')
            .select()
            .where('"equipmentType".id = :id', { id: id })
            .getOne();
    }

    async eqiupmentTypes (offset: number, limit: number) {
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
