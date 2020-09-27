import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToMany } from 'typeorm';
import { ContactInformation } from './ContactInformation';
import { CargoBike } from './CargoBike';
import { Engagement } from './Engagement';
import { Workshop } from './Workshop';

@Entity()
export class Participant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE'
    })
    start: Date;

    @Column({
        type: 'date',
        nullable: true
    })
    end: Date;

    @OneToOne(type => ContactInformation, contactInformation => contactInformation.participantId, {
        nullable: false
    })
    @JoinColumn({
        name: 'contactInformationId'
    })
    contactInformationId: number;

    @Column({
        nullable: true
    })
    usernameflotte: string;

    @Column({
        nullable: true
    })
    usernameSlack: string;

    @Column({
        type: 'simple-array'
    })
    locationZIPs: string[];

    @OneToMany(type => Engagement, engagement => engagement.participant)
    engagement: Engagement[];

    @ManyToMany(type => Workshop, workshop => workshop.participants, {
        nullable: true
    })
    workshops: Workshop[];

    @Column({
        nullable: false,
        default: false
    })
    memberCoreTeam: boolean;

    @Column({
        nullable: false,
        default: false
    })
    employeeADFC: boolean;

    @Column({
        nullable: false,
        default: false
    })
    memberADFC: boolean;
}
