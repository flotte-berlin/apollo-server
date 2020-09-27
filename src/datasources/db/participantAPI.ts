import { DataSource } from 'apollo-datasource';
import { GraphQLError } from 'graphql';
import { Connection, EntityManager, getConnection } from 'typeorm';
import { CargoBike } from '../../model/CargoBike';
import { ContactInformation } from '../../model/ContactInformation';
import { Engagement } from '../../model/Engagement';
import { Participant } from '../../model/Participant';
import { EngagementType } from '../../model/EngagementType';

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
        return (await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .leftJoinAndSelect('engagement.participant', 'participant')
            .where('engagement.id = :id', { id: id })
            .andWhere('engagement."participantId" = participant.id')
            .getOne()).participant;
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
            .getOne();
    }

    async engagementByCargoBikeId (offset: number, limit: number, id: number) {
        return await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .select()
            .where('engagement."cargoBikeId" = :id', {
                id: id
            })
            .offset(offset)
            .limit(limit)
            .orderBy('engagement.from', 'DESC')
            .addOrderBy('engagement.to', 'DESC', 'NULLS FIRST')
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
            .relation(Engagement, 'engageMent');
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
        /* let count = this.connection.getRepository(ContactInformation)
            .createQueryBuilder('contactInformation')
            .select()
            .where('contactInformation.id = :id', { id: participant.contactInformationId })
            .getCount();
        if ((await count) !== 1) {
            return new GraphQLError('contactInformationId not found.');
        }
        count = this.connection.getRepository(Participant)
            .createQueryBuilder('participant')
            .select()
            .where('participant."contactInformationId" = :id', {
                id: participant.contactInformationId
            })
            .getCount();
        if ((await count) !== 0) {
            return new GraphQLError('contactInformationId already used by other participant.');
        } */
        let inserts: any;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            inserts = await entityManager.getRepository(Participant)
                .createQueryBuilder('participant')
                .insert()
                .into(Participant)
                .values([participant])
                .returning('*')
                .execute();
            /* await entityManager.getRepository(Participant)
                .createQueryBuilder('participant')
                .relation(Participant, 'contactInformation')
                .of(inserts.identifiers[0].id)
                .set(participant.contactInformationId);
             */
        });
        /* const inserts = await this.connection.getRepository(Participant)
            .createQueryBuilder('participant')
            .insert()
            .into(Participant)
            .values([participant])
            .returning('*')
            .execute();
        await this.connection.getRepository(Participant)
            .createQueryBuilder('participant')
            .relation(Participant, 'contactInformation')
            .of(inserts.identifiers[0].id)
            .set(participant.contactInformationId);
         */
        return this.getParticipantById(inserts.identifiers[0].id);
    }

    async createEngagement (engagement: any) {
        const countB = this.connection.getRepository(CargoBike)
            .createQueryBuilder('cargoBike')
            .select()
            .where('cargoBike.id = :id', { id: engagement.cargoBikeId })
            .getCount();
        const countP = this.connection.getRepository(Participant)
            .createQueryBuilder('participant')
            .select()
            .where('participant.id = :id', { id: engagement.participantId })
            .getCount();
        if ((await countB) !== 1) { return new GraphQLError('BikeId not found'); }
        if ((await countP) !== 1) { return new GraphQLError('ParticipantId not found'); }
        // TODO check whether someone is already engaged with the bike
        const inserts = await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .insert()
            .values([engagement])
            .returning('*')
            .execute();
        await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .relation(Engagement, 'cargoBike')
            .of(inserts.identifiers[0].id)
            .set(engagement.cargoBikeId);
        await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .relation(Engagement, 'participant')
            .of(inserts.identifiers[0].id)
            .set(engagement.participantId);
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
