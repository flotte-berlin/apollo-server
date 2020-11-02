import { DataSource } from 'apollo-datasource';
import { Connection, EntityManager, getConnection } from 'typeorm';
import { ContactInformation } from '../../model/ContactInformation';
import { Engagement } from '../../model/Engagement';
import { Participant } from '../../model/Participant';
import { EngagementType } from '../../model/EngagementType';
import { ActionLogger, deleteEntity, genDateRange, LockUtils } from './utils';
import { UserInputError } from 'apollo-server-express';
import { GraphQLError } from 'graphql';

export class ParticipantAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    async participantById (id: number) {
        return await this.connection.getRepository(Participant)
            .createQueryBuilder('participant')
            .select()
            .where('id = :id', { id: id })
            .getOne();
    }

    async getParticipants (offset: number, limit: number) {
        return await this.connection.getRepository(Participant)
            .createQueryBuilder('participant')
            .select()
            .offset(offset)
            .limit(limit)
            .getMany();
    }

    async participantByEngagementId (id: number) {
        return await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .relation(Engagement, 'participantId')
            .of(id)
            .loadOne();
    }

    async participantsByCargoBikeId (id:number) {
        return await this.connection.getRepository(Engagement)// TODO do this with a sub query
            .createQueryBuilder('e')
            .select()
            .where('"dateRange" && daterange(CURRENT_DATE,CURRENT_DATE,\'[]\')')
            .andWhere('"cargoBikeId" = :id', { id: id })
            .getMany()
            .then(async (value: Engagement[]) => {
                return value?.map(async (engagement: Engagement) => {
                    return await this.connection.getRepository(Engagement)
                        .createQueryBuilder('e')
                        .relation(Engagement, 'participantId')
                        .of(engagement.id).loadOne();
                });
            });
    }

    async engagementByParticipantId (id: number) {
        return await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .select()
            .where('engagement."participantId" = :id', { id: id })
            .getMany();
    }

    async engagementByCargoBikeId (offset: number, limit: number, id: number) {
        return await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .select()
            .where('engagement."cargoBikeId" = :id', {
                id: id
            })
            .skip(offset)
            .take(limit)
            .orderBy('engagement."dateRange"', 'DESC')
            .getMany();
    }

    async currentEngagementByCargoBikeId (id: number) {
        return await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .select()
            .where('engagement."cargoBikeId" = :id', { id: id })
            .where('"dateRange" && daterange(CURRENT_DATE,CURRENT_DATE,\'[]\')')
            .orderBy('engagement."dateRange"', 'DESC')
            .getMany();
    }

    async engagements (offset: number, limit: number) {
        return await this.connection.getRepository(Engagement)
            .createQueryBuilder('e')
            .select()
            .skip(offset)
            .take(limit)
            .getMany();
    }

    async engagementById (id: number) {
        return await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .select()
            .where('engagement.id = :id', { id: id })
            .getOne();
    }

    async engagementTypeById (id: number) {
        return await this.connection.getRepository(EngagementType)
            .createQueryBuilder('et')
            .select()
            .where('id = :id', { id: id })
            .getOne();
    }

    async engagementTypes (offset: number, limit: number) {
        return await this.connection.getRepository(EngagementType)
            .createQueryBuilder('et')
            .select()
            .skip(offset)
            .take(limit)
            .getMany();
    }

    async engagementTypeByEngagementId (id: number) {
        return await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .relation(Engagement, 'engagementTypeId')
            .of(id)
            .loadOne();
    }

    async contactInformationById (id: number) {
        return await this.connection.getRepository(ContactInformation)
            .createQueryBuilder('contactInformation')
            .select()
            .where('contactInformation.id = :id', { id: id })
            .getOne();
    }

    async contactInformationByParticipantId (id: number) {
        return await this.connection.manager
            .createQueryBuilder()
            .relation(Participant, 'contactInformationId')
            .of(id)
            .loadOne();
    }

    async workshopsByParticipantId (id: number) {
        return await this.connection.getRepository(Participant)
            .createQueryBuilder('p')
            .relation(Participant, 'workshopIds')
            .of(id)
            .loadMany();
    }

    /**
     * creates participant and creates relation to given contactInformation
     * @param participant to be created
     */
    async createParticipant (participant: any) {
        let inserts: any;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            inserts = await entityManager.getRepository(Participant)
                .createQueryBuilder('participant')
                .insert()
                .into(Participant)
                .values([participant])
                .returning('*')
                .execute();
            await entityManager.getRepository(Participant)
                .createQueryBuilder('w')
                .relation(Participant, 'workshopIds')
                .of(participant.id)
                .add(participant.workshopIds);
        });
        return this.participantById(inserts?.identifiers[0].id);
    }

    async lockParticipant (id: number, userId: number) {
        return await LockUtils.lockEntity(this.connection, Participant, 'p', id, userId);
    }

    async unlockParticipant (id: number, userId: number) {
        return await LockUtils.unlockEntity(this.connection, Participant, 'p', id, userId);
    }

    async updateParticipant (participant: any, userId: number) {
        const keepLock = participant.keepLock;
        delete participant.keepLock;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, Participant, 'p', participant.id, userId)) {
                throw new GraphQLError('Participant is locked by another user');
            }
            const workshops = participant.workshopIds;
            delete participant.workshopIds;
            await ActionLogger.log(entityManager, Participant, 'p', participant, userId);
            await entityManager.getRepository(Participant)
                .createQueryBuilder('p')
                .update()
                .set({ ...participant })
                .where('id = :id', { id: participant.id })
                .execute().then(value => { if (value.affected !== 1) { throw new GraphQLError('ID not found'); } });
            await entityManager.getRepository(Participant)
                .createQueryBuilder('w')
                .relation(Participant, 'workshopIds')
                .of(participant.id)
                .add(workshops);
        });
        !keepLock && await this.unlockParticipant(participant.id, userId);
        return await this.participantById(participant.id);
    }

    async deleteParticipant (id: number, userId: number) {
        return await deleteEntity(this.connection, Participant, 'p', id, userId);
    }

    async createEngagement (engagement: any) {
        let inserts: any;
        genDateRange(engagement);
        await this.connection.transaction(async (entityManager: EntityManager) => {
            // check for overlapping engagements
            const overlapping = await entityManager.getRepository(Engagement)
                .createQueryBuilder('e')
                .select()
                .where('e."cargoBikeId" = :id', { id: engagement.cargoBikeId })
                .andWhere('e."dateRange" && :dr', { dr: engagement.dateRange })
                .andWhere('e."engagementTypeId" = :etId', { etId: engagement.engagementTypeId })
                .getMany();
            if (overlapping.length > 0) {
                throw new UserInputError('Engagements with ids: ' + overlapping.map((e) => { return e.id + ', '; }) + 'are overlapping');
            }
            inserts = await entityManager.getRepository(Engagement)
                .createQueryBuilder('engagement')
                .insert()
                .values([engagement])
                .returning('*')
                .execute();
        });
        return this.engagementById(inserts?.identifiers[0].id);
    }

    async lockEngagement (id: number, userId: number) {
        return await LockUtils.lockEntity(this.connection, Engagement, 'e', id, userId);
    }

    async unlockEngagement (id: number, userId: number) {
        return await LockUtils.unlockEntity(this.connection, Engagement, 'e', id, userId);
    }

    async updateEngagement (engagement: any, userId: number) {
        const keepLock = engagement.keepLock;
        delete engagement.keepLock;
        genDateRange(engagement);
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, Engagement, 'e', engagement.id, userId)) {
                throw new GraphQLError('Engagement is locked by other user');
            }
            await ActionLogger.log(entityManager, Engagement, 'e', engagement, userId);
            // check for overlapping engagements
            const overlapping = await entityManager.getRepository(Engagement)
                .createQueryBuilder('e')
                .select()
                .where('e."cargoBikeId" = :id', { id: engagement.cargoBikeId })
                .andWhere('e."dateRange" && :dr', { dr: engagement.dateRange })
                .andWhere('e."engagementTypeId" = :etId', { etId: engagement.engagementTypeId })
                .andWhere('e.id != :eid', { eid: engagement.id })
                .getMany();
            if (overlapping.length > 0) {
                throw new UserInputError('Engagements with ids: ' + overlapping.map((e) => { return e.id + ', '; }) + 'are overlapping');
            }
            await entityManager.getRepository(Engagement)
                .createQueryBuilder('engagement')
                .update()
                .set({ ...engagement })
                .where('id = :id', { id: engagement.id })
                .execute();
        });
        !keepLock && await LockUtils.unlockEntity(this.connection, Engagement, 'e', engagement.id, userId);
        return await this.engagementById(engagement.id);
    }

    async deleteEngagement (id: number, userId: number) {
        return await deleteEntity(this.connection, Engagement, 'e', id, userId);
    }

    async createEngagementType (engagementType: any) {
        const inserts = await this.connection.getRepository(EngagementType)
            .createQueryBuilder('et')
            .insert()
            .values([engagementType])
            .returning('*')
            .execute();
        inserts.generatedMaps[0].id = inserts.identifiers[0].id;
        return inserts.generatedMaps[0];
    }

    async lockEngagementType (id:number, userId: number) {
        return await LockUtils.lockEntity(this.connection, EngagementType, 'e', id, userId);
    }

    async unlockEngagementType (id:number, userId: number) {
        return await LockUtils.unlockEntity(this.connection, EngagementType, 'e', id, userId);
    }

    async updateEngagementType (engagementType: any, userId: number) {
        const keepLock = engagementType.keepLock;
        delete engagementType.keepLock;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, EngagementType, 'et', engagementType.id, userId)) {
                throw new GraphQLError('EngagementType is locked by other user');
            }
            await ActionLogger.log(entityManager, EngagementType, 'et', engagementType, userId);
            await entityManager.getRepository(EngagementType)
                .createQueryBuilder('et')
                .update()
                .set({ ...engagementType })
                .where('id = :id', { id: engagementType.id })
                .execute();
        });
        !keepLock && await LockUtils.unlockEntity(this.connection, EngagementType, 'et', engagementType.id, userId);
        return await this.engagementTypeById(engagementType.id);
    }

    async deleteEngagementType (id: number, userId: number) {
        return await deleteEntity(this.connection, EngagementType, 'et', id, userId);
    }
}
