import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Participant } from './Participant';
import { CargoBike, Lockable } from './CargoBike';
import { EngagementType } from './EngagementType';

@Entity()
export class Engagement implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Participant, participant => participant.engagement, {
        nullable: false
    })
    @JoinColumn({
        name: 'participantId'
    })
    participantId: number;

    @ManyToOne(type => CargoBike, cargoBike => cargoBike.engagement, {
        nullable: false
    })
    @JoinColumn({
        name: 'cargoBikeId'
    })
    cargoBikeId: number;

    @ManyToOne(type => EngagementType, engagementType => engagementType.engagementIds, {
        nullable: false
    })
    @JoinColumn({
        name: 'engagementTypeId'
    })
    engagementTypeId: number;

    // I have to find out how typorm will map the datetange data type.
    @Column({
        type: 'daterange',
        default: () => 'daterange(CURRENT_DATE,\'infinity\',\'[)\')'
    })
    dateRange: Date[];

    @Column({
        type: 'boolean',
        default: false
    })
    roleCoordinator: boolean;

    @Column({
        type: 'boolean',
        default: false
    })
    roleMentor: boolean;

    @Column({
        type: 'boolean',
        default: false
    })
    roleAmbulance: boolean;

    @Column({
        type: 'boolean',
        default: false
    })
    roleBringer: boolean;

    @Column({
        nullable: true,
        type: 'timestamp'
    })
    lockedUntil: Date;

    @Column({
        nullable: true
    })
    lockedBy: number;
}
