import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Participant } from './Participant';
import { CargoBike } from './CargoBike';
import { EngagementType } from './EngagementType';

@Entity()
export class Engagement {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Participant, participant => participant.engagement, {
    })
    @JoinColumn({
        name: 'participantId'
    })
    participant: Participant;

    @ManyToOne(type => CargoBike, cargoBike => cargoBike.engagement)
    cargoBike: CargoBike;

    @ManyToOne(type => EngagementType, engagementType => engagementType.engagementIds)
    engagementTypeId: number;

    // I have to find out how typorm will map the datetange data type.
    @Column({
        type: 'daterange'
    })
    dateRange: Date[];

    @Column()
    roleCoordinator: boolean;

    @Column()
    roleMentor: boolean;

    @Column()
    roleAmbulance: boolean;

    @Column()
    roleBringer: boolean;
}
