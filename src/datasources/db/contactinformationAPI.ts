import { DataSource } from 'apollo-datasource';
import { Connection, getConnection } from 'typeorm';
import { ContactInformation } from '../../model/ContactInformation';
import { Person } from '../../model/Person';

export class ContactInformationAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    async numContactInformationById (id: number) {
        return await this.connection.getRepository(ContactInformation)
            .createQueryBuilder('contactInformation')
            .select()
            .where('"contactInformation".id = :id', { id: id })
            .getCount();
    }

    async contactInformation (offset: number, limit: number) {
        return await this.connection.getRepository(ContactInformation)
            .createQueryBuilder('contactinformation')
            .select()
            .offset(offset)
            .limit(limit)
            .getMany();
    }

    async contactInformationById (id: number) {
        return await this.connection.getRepository(ContactInformation)
            .createQueryBuilder('ci')
            .select()
            .where('id = :id', { id: id })
            .getOne();
    }

    async createPerson (person: any) {
        const inserts = await this.connection.getRepository(Person)
            .createQueryBuilder('person')
            .insert()
            .values([person])
            .returning('*')
            .execute();
        inserts.generatedMaps[0].id = inserts.identifiers[0].id;
        return inserts.generatedMaps[0];
    }

    async persons (offset: number, limit: number) {
        return await this.connection.getRepository(Person)
            .createQueryBuilder('person')
            .select()
            .skip(offset)
            .take(limit)
            .execute();
    }

    async personById (id: number) {
        return await this.connection.getRepository(Person)
            .createQueryBuilder('p')
            .select()
            .where('id = :id', { id: id })
            .getOne();
    }

    async personByContactInformationId (id: number) {
        return await this.connection.getRepository(ContactInformation)
            .createQueryBuilder('ci')
            .relation(ContactInformation, 'personId')
            .of(id)
            .loadOne();
    }

    async createContactInformation (contactInformation: any) {
        const inserts = await this.connection.getRepository(ContactInformation)
            .createQueryBuilder('contactInformation')
            .insert()
            .into(ContactInformation)
            .values([contactInformation])
            .returning('*')
            .execute();
        return inserts.generatedMaps[0];
    }

    async contactInformationByPersonId (id: number) {
        const res = await this.connection.getRepository(ContactInformation)
            .createQueryBuilder('ci')
            .select()
            .where('ci."personId" = :id', { id: id })
            .getMany();
        return res;
    }
}
