import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm';
import { Participant } from './Participant';
import { WorkshopType } from './WorkshopType';
import { Lockable } from './CargoBike';

@Entity()
export class Workshop implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => WorkshopType, workshopType => workshopType.workshopIds)
    workshopTypeId: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({
        type: 'date'
    })
    date: Date;

    @ManyToMany(type => Participant, participant => participant.workshops, {
        nullable: true
    })
    participants: Participant[];

    @ManyToOne(type => Participant, {
        nullable: false
    })
    trainer1Id: number;

    @ManyToOne(type => Participant, {
        nullable: true
    })
    trainer2: Participant;

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
