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
        type: 'date'
    })
    start: Date;

    @Column({
        type: 'date',
        nullable: true
    })
    end: Date;

    @OneToOne(type => ContactInformation, contactInformation => contactInformation.participant, {
        nullable: true
    })
    @JoinColumn()
    contactInformation: ContactInformation;

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

    // this should go, we dont need it
    @OneToMany(type => CargoBike, cargoBike => cargoBike.coordinator)
    cargoBikes: CargoBike[];

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

    @Column()
    memberADFC: boolean;
}
