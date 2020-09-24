import { DataSource } from 'apollo-datasource';
import { GraphQLError } from 'graphql';
import { Connection, getConnection } from 'typeorm';
import { ContactInformation } from '../../model/ContactInformation';
import { ContactPerson } from '../../model/ContactPerson';
import { LendingStation } from '../../model/LendingStation';

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
            .createQueryBuilder('contactInformation')
            .select()
            .where('"contactInformation".id = :id', { id: id })
            .getOne();
    }

    async contactPersonsByLendingStationId (id: number) {
        return await this.connection
            .createQueryBuilder()
            .relation(LendingStation, 'contactPersons')
            .of(id)
            .loadMany();
    }

    async contactInformationByContactPersonId (id: number) {
        return (await this.connection.getRepository(ContactPerson)
            .createQueryBuilder('contactPerson')
            .leftJoinAndSelect('contactPerson.contactInformation', 'contactInformation')
            .where('"contactPerson".id = :id', { id: id })
            .getOne())?.contactInformation || new GraphQLError('ContactPerson has no ContactInformtion');
    }

    async createContactPerson (contactPerson: any) {
        if (await this.contactInformationById(contactPerson.contactInformationId)) {
            let inserts: any;
            try {
                await this.connection.transaction(async entiyManager => {
                    inserts = await entiyManager.createQueryBuilder(ContactPerson, 'contactPerson')
                        .insert()
                        .values([contactPerson])
                        .returning('*')
                        .execute();
                    await entiyManager.createQueryBuilder()
                        .relation(ContactPerson, 'contactInformation')
                        .of(inserts.identifiers[0].id)
                        .set(contactPerson.contactInformationId);
                });
            } catch (e: any) {
                return new GraphQLError('Transaction could not be completed');
            }
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
