import { DataSource } from 'apollo-datasource';
import { GraphQLBoolean, GraphQLError } from 'graphql';
import { Connection, getConnection } from 'typeorm';
import { CargoBike } from '../../model/CargoBike';
import { ContactInformation } from '../../model/ContactInformation';
import { Engagement } from '../../model/Engagement';
import { Participant } from '../../model/Participant';

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
    async engagementByParticipantId (id: number) {
        return await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .select()
            .where('engagement."participantId" = :id', { id: id })
            .getOne();
    }

    async engagementById (id: number) {
        return await this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .select()
            .where('engagement.id = :id', { id: id })
            .getOne();
    }

    async contactInformationById (id: number) {
        return await this.connection.getRepository(ContactInformation)
            .createQueryBuilder('contactInformation')
            .select()
            .where('contactInformation.id = :id', { id: id })
            .getOne();
    }

    async contactInformationByParticipantId (id: number) {
        const ret = (await this.connection.getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.contactInformation', 'contactInformation')
            .where('participant."contactInformationId" = "contactInformation".id')
            .andWhere('participant.id = :id', { id: id })
            .printSql()
            .getOne());
        return (ret) ? ret.contactInformation : null;
    }

    /**
     * creates participant and creates realtion to given contactInformation
     * @param participant to be created
     */
    async createParticipant (participant: any) {
        let count = this.connection.getRepository(ContactInformation)
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
        }
        const inserts = await this.connection.getRepository(Participant)
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
        return this.getParticipantById((await inserts).identifiers[0].id);
    }

    async createContactInformation (contactInformation: any) {
        const inserts = await this.connection.getRepository(ContactInformation)
            .createQueryBuilder('contactInformation')
            .insert()
            .into(ContactInformation)
            .values([contactInformation])
            .returning('*')
            .execute();
        return this.contactInformationById(inserts.identifiers[0].id);
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
        this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .relation(Engagement, 'cargoBike')
            .of(inserts.identifiers[0].id)
            .set(engagement.cargoBikeId);
        this.connection.getRepository(Engagement)
            .createQueryBuilder('engagement')
            .relation(Engagement, 'participant')
            .of(inserts.identifiers[0].id)
            .set(engagement.participantId);
        console.log(inserts);
        return this.engagementById(inserts.identifiers[0].id);
    }
}
