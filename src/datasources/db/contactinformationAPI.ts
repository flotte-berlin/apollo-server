import { DataSource } from 'apollo-datasource';
import { Connection, getConnection } from 'typeorm';
import { ContactInformation } from '../../model/ContactInformation';
import { ContactPerson } from '../../model/ContactPerson';

export class ContactInformationAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    async contactPersonById (id: number) {
        return await this.connection.getRepository(ContactPerson)
            .createQueryBuilder('contactPerson')
            .select()
            .where('"contactPerson".id = :id', { id: id })
            .getOne();
    }

    async numContactInformationById (id: number) {
        return await this.connection.getRepository(ContactInformation)
            .createQueryBuilder('contactInformation')
            .select()
            .where('"contactInformation".id = :id', { id: id })
            .getCount();
    }

    async contactInformationById (id: number) {
        return await this.connection.getRepository(ContactInformation)
            .createQueryBuilder('contactInformation')
            .select()
            .where('"contactInformation".id = :id', { id: id })
            .getOne();
    }

    async contactPersonByLendingStationId (id: number) {
        return await this.connection.getRepository(ContactPerson)
            .createQueryBuilder('contactPerson')
            .leftJoinAndSelect('contactPerson.lendingStation', 'lendingStation')
            .where('"lendingStation".id = :id', { id: id })
            .getMany().catch(() => { return []; });
    }

    async contactInformationByContactPersonId (id: number) {
        return (await this.connection.getRepository(ContactPerson)
            .createQueryBuilder('contactPerson')
            .leftJoinAndSelect('contactPerson.contactInformation', 'contactInformation')
            .where('"contactPerson".id = :id', { id: id })
            .getOne())?.contactInformation;
    }

    async createContactPerson (contactPerson: any) {
        if (await this.contactInformationById(contactPerson.contactInformationId)) {
            const inserts = await this.connection.getRepository(ContactPerson)
                .createQueryBuilder('contactPerson')
                .insert()
                .values([contactPerson])
                .returning('*')
                .execute();
            await this.connection.getRepository(ContactPerson)
                .createQueryBuilder('contactPerson')
                .relation(ContactPerson, 'contactInformation')
                .of(inserts.identifiers[0].id)
                .set(contactPerson.contactInformationId);
            return this.contactPersonById(inserts.identifiers[0].id);
        } else {
            return null;
        }
    }

    async updateContactPerson (contactPerson: any) {
        if (await this.contactPersonById(contactPerson.id)) {
            const contactInformationId = contactPerson.contactInformationId;
            delete contactPerson.contactInformationId;
            if (contactInformationId) {
                if (await this.contactInformationById(contactInformationId)) {
                    await this.connection.getRepository(ContactPerson)
                        .createQueryBuilder('contactPerson')
                        .update(ContactPerson)
                        .set({ ...contactPerson })
                        .where('id = :id', { id: contactPerson.id })
                        .execute();
                    await this.connection.getRepository(ContactPerson)
                        .createQueryBuilder('contactPerson')
                        .relation(ContactPerson, 'contactInformation')
                        .of(contactPerson.id)
                        .set(contactInformationId);
                } else {
                    // supplied contactinformationId not found
                    return null;
                }
                return this.contactPersonById(contactPerson.id);
            } else {
                await this.connection.getRepository(ContactPerson)
                    .createQueryBuilder('contactPerson')
                    .update(ContactPerson)
                    .set({ ...contactPerson })
                    .where('id = :id', { id: contactPerson.id })
                    .execute();
                return this.contactPersonById(contactPerson.id);
            }
        } else {
            // updated bike not found
            return null;
        }
    }
}
