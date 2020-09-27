import { DataSource } from 'apollo-datasource';
import { Connection, getConnection } from 'typeorm';
import { WorkshopType } from '../../model/WorkshopType';
import { Workshop } from '../../model/Workshop';

export class WorkshopAPI extends DataSource {
    connection: Connection

    constructor () {
        super();
        this.connection = getConnection();
    }

    async createWorkshop (workshop: any) {
        const inserts = await this.connection.getRepository(Workshop)
            .createQueryBuilder('w')
            .insert()
            .values([workshop])
            .returning('*')
            .execute();
        return inserts.generatedMaps[0];
    }

    async createWorkshopType (workshopType: any) {
        const inserts = await this.connection.getRepository(WorkshopType)
            .createQueryBuilder('wt')
            .insert()
            .values([workshopType])
            .returning('*')
            .execute();
        return inserts.generatedMaps[0];
    }

    async workshopTypes (offset: number, limit: number) {
        return await this.connection.getRepository(WorkshopType)
            .createQueryBuilder('w')
            .select()
            .skip(offset)
            .take(limit)
            .getMany();
    }

    /**
     * finds workshops with pagination
     * @param offset
     * @param limit
     */
    async workshops (offset: number, limit: number) {
        return await this.connection.getRepository(Workshop)
            .createQueryBuilder('w')
            .select()
            .skip(offset)
            .take(limit)
            .getMany();
    }

    async trainer1ByWorkshopId (id: number) {
        return await this.connection.getRepository(Workshop)
            .createQueryBuilder('w')
            .relation(Workshop, 'trainer1Id')
            .of(id)
            .loadOne();
    }

    async trainer2ByWorkshopId (id: number) {
        return await this.connection.getRepository(Workshop)
            .createQueryBuilder('w')
            .relation(Workshop, 'trainer2Id')
            .of(id)
            .loadOne();
    }
}
