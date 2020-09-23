import { DataSource } from 'apollo-datasource';
import { getConnection, Connection, ObjectType } from 'typeorm';
import { CargoBike, Lockable } from '../../model/CargoBike';
import { GraphQLError } from 'graphql';
import { BikeEvent } from '../../model/BikeEvent';
import { Equipment } from '../../model/Equipment';
import { Engagement } from '../../model/Engagement';

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
        return (await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .leftJoinAndSelect('engagement.cargoBike', 'cargoBike')
            .where('engagement."cargoBikeId" = "cargoBike".id')
            .andWhere('engagement.id = :id', { id: id })
            .getOne())?.cargoBike;
    }

    async lockCargoBike (id: number, req: any, dataSources: any) {
        return this.lockEntity(CargoBike, 'cargobike', id, req, dataSources);
    }

    async unlockCargoBike (id: number, req: any, dataSources: any) {
        return this.unlockEntity(CargoBike, 'cargobike', id, req, dataSources);
    }

    /**
     * locks any entity that implemts Lockable
     */
    async lockEntity (target: ObjectType<Lockable>, alias: string, id: number, req: any, dataSources: any) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const userId = await dataSources.userAPI.getUserId(token);
        const lock = await this.connection.getRepository(target)
            .createQueryBuilder(alias)
            .select([
                alias + '.lockedUntil',
                alias + '.lockedBy'
            ])
            .where('id = :id', {
                id: id
            })
            .andWhere(alias + '.lockedUntil > CURRENT_TIMESTAMP')
            .getOne();
        // eslint-disable-next-line eqeqeq
        if (!lock?.lockedUntil || lock?.lockedBy == userId) {
            // no lock -> set lock
            await this.connection.getRepository(target)
                .createQueryBuilder(alias)
                .update()
                .set({
                    lockedUntil: () => 'CURRENT_TIMESTAMP + INTERVAL \'10 MINUTE\'',
                    lockedBy: userId
                })
                .where('id = :id', { id: id })
                .execute();
            return true;
        } else {
            // lock was set
            return false;
        }
    }

    async unlockEntity (target: ObjectType<Lockable>, alias: string, id: number, req: any, dataSources: any) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const userId = await dataSources.userAPI.getUserId(token);
        const lock = await this.connection.getRepository(target)
            .createQueryBuilder(alias)
            .select([
                alias + '.lockedUntil',
                alias + '.lockedBy'
            ])
            .where('id = :id', {
                id: id
            })
            .andWhere(alias + '.lockedUntil > CURRENT_TIMESTAMP')
            .getOne();
        if (!lock?.lockedUntil) {
            // no lock
            return true;
        // eslint-disable-next-line eqeqeq
        } else if (lock?.lockedBy == userId) {
            // user can unlock
            await this.connection.getRepository(target)
                .createQueryBuilder(alias)
                .update()
                .set({
                    lockedUntil: null,
                    lockedBy: null
                })
                .where('id = :id', { id: id })
                .execute();
            return true;
        } else {
            // enity is locked by other user
            return false;
        }
    }

    /**
     * Updates CargoBike and return updated cargoBike
     * @param param0 cargoBike to be updated
     */
    async updateCargoBike (cargoBike: any, req: any, dataSources: any) {
        if (!await this.lockCargoBike(cargoBike.id, req, dataSources)) {
            return new GraphQLError('Bike locked by other user');
        }
        const bike = await this.connection.manager.createQueryBuilder()
            .select('cargoBike')
            .from(CargoBike, 'cargoBike')
            .where('cargoBike.id = :id', { id: cargoBike.id })
            .getOne();
        if (bike.id) {
            const lendingStationId = cargoBike.lendingStationId;
            delete cargoBike.lendingStationId;
            await this.connection.manager
                .createQueryBuilder()
                .update(CargoBike)
                .set({ ...cargoBike })
                .where('id = :id', { id: bike.id })
                .execute();
            if (lendingStationId || lendingStationId === null) {
                await this.connection.getRepository(CargoBike)
                    .createQueryBuilder()
                    .relation(CargoBike, 'lendingStation')
                    .of(cargoBike.id)
                    .set(lendingStationId);
            }
            return await this.findCargoBikeById(bike.id);
        } else {
            return new GraphQLError('ID not in database');
        }
    }

    /**
     * createCargoBike
     * created CargoBike and returns created bike with new ID
     * @param param0 cargoBike to be created
     */
    async createCargoBike ({ cargoBike }: { cargoBike: any }) {
        const inserts = await this.connection.manager
            .createQueryBuilder()
            .insert()
            .into(CargoBike)
            .values([cargoBike])
            .returning('*')
            .execute();
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

    // think this can go
    async findEquipmentJoinBikeById (id: number) {
        return await this.connection.getRepository(Equipment)
            .createQueryBuilder('equipment')
            .leftJoinAndSelect('equipment.cargoBike', 'cargoBike')
            .where('equipment.id = :id', { id: id })
            .getOne();
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
            // return this.findEquipmentJoinBikeById(inserts.identifiers[0].id);
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
        return this.lockEntity(Equipment, 'equipment', id, req, dataSources);
    }

    /**
     * Will update Equipment, crashes when id not in db or cargoBikeId not db.
     * Will return updated Equipment joined with CargoBike only if cargoBike is was set in param0
     * @param param0 struct with equipment properites
     */
    async updateEquipment (equipment: any, req: any, dataSources: any) {
        if (!await this.lockEntity(Equipment, 'equipment', equipment.id, req, dataSources)) {
            return new GraphQLError('Equipment locked by other user');
        }
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
            return this.findEquipmentJoinBikeById(equipment.id);
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
}
