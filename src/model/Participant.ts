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

    @OneToOne(type => ContactInformation, {
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

    @Column()
    memberADFC: boolean;

    @Column({
        type: 'simple-array'
    })
    locationZIPs: string[];

    @OneToMany(type => CargoBike, cargoBike => cargoBike.coordinator)
    cargoBikes: CargoBike[];

    @OneToMany(type => Engagement, engagement => engagement.participant)
    engagement: Engagement[];

    @ManyToMany(type => Workshop, workshop => workshop.participants, {
        nullable: true
    })
    workshops: Workshop[];

    @Column()
    memberCoreTeam: boolean;

    @Column({
        type: 'date',
        nullable: true
    })
    workshopMentor: Date;

    @Column({
        type: 'date',
        nullable: true
    })
    workshopAmbulance: Date;

    @Column({
        nullable: true
    })
    reserve: string;
}
