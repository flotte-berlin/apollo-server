import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Participant } from './Participant';

@Entity()
export class Workshop {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

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
}
