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
        type: 'date'
    })
    end: Date;

    @OneToOne(type => ContactInformation)
    @JoinColumn()
    contactInformation: ContactInformation;

    @Column()
    usernameflotte: string;

    @Column()
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
    roleCoreTeam: boolean;

    @Column()
    roleCoordinator: boolean;

    @Column()
    roleEmployeADFC: boolean;

    @Column()
    roleMentor: boolean;

    @Column()
    roleAmbulance: boolean;

    @Column()
    roleBringer: boolean;

    @Column({
        type: 'date'
    })
    workshopMentor: Date;

    @Column({
        type: 'date'
    })
    workshopAmbulance: Date;

    @Column({
        nullable: true
    })
    reserve: string;
}
