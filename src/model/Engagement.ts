import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Participant } from './Participant';
import { CargoBike } from './CargoBike';

@Entity()
export class Engagement {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Participant, participant => participant.engagement)
    participant: Participant;

    @ManyToOne(type => CargoBike, cargoBike => cargoBike.engagement)
    cargoBike: CargoBike;

    @Column({
        type: 'date'
    })
    from: Date;

    @Column({
        type: 'date',
        nullable: true
    })
    to: Date;

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
}
