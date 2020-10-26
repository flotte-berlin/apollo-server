import { DataSource } from 'apollo-datasource';
import { Connection, EntityManager, getConnection } from 'typeorm';
import { ContactInformation } from '../../model/ContactInformation';
import { Person } from '../../model/Person';
import { ActionLogger, deleteEntity, LockUtils } from './utils';
import { GraphQLError } from 'graphql';
import { LendingStation } from '../../model/LendingStation';

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
            .createQueryBuilder('ci')
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

    async lockPerson (id: number, userId: number) {
        return await LockUtils.lockEntity(this.connection, Person, 'p', id, userId);
    }

    async unlockPerson (id: number, userId: number) {
        return await LockUtils.unlockEntity(this.connection, Person, 'p', id, userId);
    }

    async updatePerson (person: any, userId: number) {
        const keepLock = person.keepLock;
        delete person.keepLock;
        await this.connection.transaction(async (entityManger: EntityManager) => {
            if (await LockUtils.isLocked(entityManger, Person, 'p', person.id, userId)) {
                throw new GraphQLError('Person is locker by another user');
            }
            await ActionLogger.log(entityManger, Person, 'p', person, userId);
            await entityManger.getRepository(Person)
                .createQueryBuilder('p')
                .update()
                .set({ ...person })
                .where('id = :id', { id: person.id })
                .execute().then(value => { if (value.affected !== 1) { throw new GraphQLError('Id not found'); } });
        });
        !keepLock && await this.unlockPerson(person.id, userId);
        return this.personById(person.id);
    }

    async deletePerson (id: number, userId: number) {
        return await deleteEntity(this.connection, Person, 'p', id, userId);
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

    async contactInternByLendingStationId (id: number) {
        return this.connection.getRepository(LendingStation)
            .createQueryBuilder('ls')
            .relation(LendingStation, 'contactInformationInternId')
            .of(id)
            .loadOne();
    }

    async contactExternByLendingStationId (id: number) {
        return this.connection.getRepository(LendingStation)
            .createQueryBuilder('ls')
            .relation(LendingStation, 'contactInformationExternId')
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

    async lockContactInformation (id: number, userId: number) {
        return await LockUtils.lockEntity(this.connection, ContactInformation, 'ci', id, userId);
    }

    async unlockContactInformation (id: number, userId: number) {
        return await LockUtils.unlockEntity(this.connection, ContactInformation, 'ci', id, userId);
    }

    async updateContactInformation (contactInformation: any, userId: number) {
        const keepLock = contactInformation.keepLock;
        delete contactInformation.keepLock;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, ContactInformation, 'ci', contactInformation.id, userId)) {
                throw new GraphQLError('ContactInformation is locked by other user');
            }
            await ActionLogger.log(entityManager, ContactInformation, 'ci', contactInformation, userId);
            await entityManager.getRepository(ContactInformation)
                .createQueryBuilder('ci')
                .update()
                .set({ ...contactInformation })
                .where('id = :id', { id: contactInformation.id })
                .execute();
        });
        !keepLock && await LockUtils.unlockEntity(this.connection, ContactInformation, 'ci', contactInformation.id, userId);
        return await this.contactInformationById(contactInformation.id);
    }

    async deleteContactInformation (id: number, userId: number) {
        return await deleteEntity(this.connection, ContactInformation, 'ci', id, userId);
    }

    async contactInformationByPersonId (id: number) {
        return await this.connection.getRepository(ContactInformation)
            .createQueryBuilder('ci')
            .select()
            .where('ci."personId" = :id', { id: id })
            .getMany();
    }
}
