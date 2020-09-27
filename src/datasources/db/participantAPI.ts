import { DataSource } from 'apollo-datasource';
import { Connection, EntityManager, getConnection } from 'typeorm';
import { ContactInformation } from '../../model/ContactInformation';
import { Engagement } from '../../model/Engagement';
import { Participant } from '../../model/Participant';
import { EngagementType } from '../../model/EngagementType';
import { genDateRange } from './utils';
import { UserInputError } from 'apollo-server';

export class ParticipantAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    async getParticipantById (id: number) {
        return await this.connection.getRepository(Participant)
            .createQueryBuilder('participant')
            .select()
            .where('participant.id = :id', { id: id })
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

    async participantByCargoBikeId (id:number) {
        return await this.connection.getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.cargoBike', 'cargoBike')
            .where('"cargoBike".id = :id', { id: id })
            .andWhere('"cargoBike"."participantId" = participant.id')
            .getOne();
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

    async engagementById (id: number) {
        return await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .select()
            .where('engagement.id = :id', { id: id })
            .getOne();
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

    /**
     * creates participant and creates realtion to given contactInformation
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
        });
        return this.getParticipantById(inserts.identifiers[0].id);
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
        return this.engagementById(inserts.identifiers[0].id);
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
}
