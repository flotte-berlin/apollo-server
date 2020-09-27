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
     * Finds cargo bike by id, retuns null if id was not found
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

    async lockCargoBike (id: number, req: any, dataSources: any) {
        if (await LockUtils.lockEntity(this.connection, CargoBike, 'cargobike', id, req, dataSources)) {
            return this.findCargoBikeById(id);
        } else {
            return new GraphQLError('CargoBike is locked by other user');
        }
    }

    async unlockCargoBike (id: number, req: any, dataSources: any) {
        return this.unlockEntity(CargoBike, 'cargobike', id, req, dataSources);
    }

    async lockEntity (target: ObjectType<Lockable>, alias: string, id: number, req: any, dataSources: any) {
        return LockUtils.lockEntity(this.connection, target, alias, id, req, dataSources);
    }

    async unlockEntity (target: ObjectType<Lockable>, alias: string, id: number, req: any, dataSources: any) {
        return LockUtils.unlockEntity(this.connection, target, alias, id, req, dataSources);
    }

    async isLocked (id: number, req: any, dataSources: any) {
        return LockUtils.isLocked(this.connection, CargoBike, 'cargobike', id, req, dataSources);
    }

    /**
     * Updates CargoBike and return updated cargoBike
     * @param param0 cargoBike to be updated
     */
    async updateCargoBike (cargoBike: any, req: any, dataSources: any) {
        // TODO lock cargoBike can return error to save one sql query, this will be a complex sql query
        if (!await this.checkId(CargoBike, 'cargobike', cargoBike.id)) {
            return new GraphQLError('ID not found');
        }
        if (!await this.lockCargoBike(cargoBike.id, req, dataSources)) {
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
        !keepLock && await this.unlockCargoBike(cargoBike.id, req, dataSources);
        return await this.findCargoBikeById(cargoBike.id);
    }

    /**
     * createCargoBike
     * created CargoBike and returns created bike with new ID
     * @param param0 cargoBike to be created
     */
    async createCargoBike ({ cargoBike }: { cargoBike: any }) {
        let inserts: any;
        try {
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
        } catch (e: any) {
            console.log(e);
            return new GraphQLError('Transaction could not be completed');
        }
        const newbike = inserts.generatedMaps[0];
        newbike.id = inserts.identifiers[0].id;
        return newbike;
    }

    async createBikeEvent ({ bikeEvent }: { bikeEvent: any }) {
        const event = new BikeEvent();
        event.setValues(bikeEvent);
        event.cargoBike = await this.findCargoBikeById(bikeEvent.cargoBikeId) as unknown as CargoBike;
        if (event.cargoBike instanceof GraphQLError) {
            return event.cargoBike;
        }
        return await this.connection.manager.save(event);
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

    async findEquipmentById (id: number) {
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
        return this.findEquipmentById(inserts.identifiers[0].id);
    }

    async cargoBikeByEquipmentId (id: number) {
        return (await this.connection.getRepository(Equipment)
            .createQueryBuilder('equipment')
            .leftJoinAndSelect('equipment.cargoBike', 'cargoBike')
            .where('equipment.id = :id', { id: id })
            .getOne())?.cargoBike;
    }

    async lockEquipment (id: number, req: any, dataSources: any) {
        if (await this.lockEntity(Equipment, 'equipment', id, req, dataSources)) {
            return this.findEquipmentById(id);
        } else {
            return new GraphQLError('Equipment locked by other user');
        }
    }

    async unlockEquipment (id: number, req: any, dataSources: any) {
        return await this.unlockEntity(Equipment, 'equipment', id, req, dataSources);
    }

    /**
     * Will update Equipment, crashes when id not in db or cargoBikeId not db.
     * Will return updated Equipment joined with CargoBike only if cargoBike is was set in param0
     * @param param0 struct with equipment properites
     */
    async updateEquipment (equipment: any, req: any, dataSources: any) {
        // TODO let lock cargoBike can return error to save one sql query, this will be a complex sql query
        if (!await this.checkId(Equipment, 'alias', equipment.id)) {
            return new GraphQLError('ID not found in DB');
        }
        if (!await this.lockEntity(Equipment, 'equipment', equipment.id, req, dataSources)) {
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
            !keepLock && this.unlockCargoBike(equipment.id, req, dataSources);
            return this.findEquipmentById(equipment.id);
        }
        return this.findEquipmentById(equipment.id);
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

    async equipmentTypeByCargoBikeId (id: number) {
        return this.connection.getRepository(CargoBike)
            .createQueryBuilder('cargobike')
            .relation(CargoBike, 'equipmentTypeIds')
            .of(id)
            .loadMany();
    }
}
