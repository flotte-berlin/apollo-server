import { DataSource } from 'apollo-datasource';
import { getConnection, Connection } from 'typeorm';
import { CargoBike } from '../../model/CargoBike';
import { GraphQLError } from 'graphql';
import { BikeEvent } from '../../model/BikeEvent';
import { Equipment } from '../../model/Equipment';

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
    async findCargoBikeById ({ id }:{id: any}) {
        return await this.connection.manager.getRepository(CargoBike).findOne({ id: id });
        /* .createQueryBuilder()
            .select('cargoBike')
            .from(CargoBike, 'cargoBike')
            .where('cargoBike.id = :id', { id })
            .getOne() || new GraphQLError('ID not found'); */
    }

    /**
     * Updates CargoBike and return updated cargoBike
     * @param param0 cargoBike to be updated
     */
    async updateCargoBike ({ cargoBike }:{ cargoBike: CargoBike }) {
        const bike = await this.connection.manager.createQueryBuilder()
            .select('cargoBike')
            .from(CargoBike, 'cargoBike')
            .where('cargoBike.id = :id', { id: cargoBike.id })
            .getOne();
        if (bike) {
            await this.connection.manager
                .createQueryBuilder()
                .update(CargoBike)
                .set({ ...cargoBike })
                .where('id = :id', { id: bike.id })
                .execute();
            return await this.findCargoBikeById({ id: bike.id });
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
        event.cargoBike = await this.findCargoBikeById({ id: bikeEvent.cargoBikeId }) as unknown as CargoBike;
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

    async findEquipmentJoinBikeById (id: number) {
        return await this.connection.getRepository(Equipment)
            .createQueryBuilder('equipment')
            .leftJoinAndSelect('equipment.cargoBike', 'cargoBike')
            .where('equipment.id = :id', { id: id })
            .getOne();
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
            return this.findEquipmentJoinBikeById(inserts.identifiers[0].id);
        }
        return this.findEquipmentById(inserts.identifiers[0].id);
    }

    /**
     * Will update Equipment, crashes when id not in db or cargoBikeId not db.
     * Will return updated Equipment joined with CargoBike only if cargoBike is was set in param0
     * @param param0 struct with equipment properites
     */
    async updateEquipment ({ equipment }: { equipment: any }) {
        console.log(equipment);
        const cargoBikeId = equipment.cargoBikeId;
        delete equipment.cargoBikeId;
        console.log(equipment);
        const inserts = await this.connection.getRepository(Equipment)
            .createQueryBuilder('equipment')
            .update()
            .set({ ...equipment })
            .where('id = :id', { id: equipment.id })
            .returning('*')
            .execute();
        console.log(inserts.raw[0]);
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
