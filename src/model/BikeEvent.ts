/* eslint no-unused-vars: "off" */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, TreeLevelColumn } from 'typeorm';
import { CargoBike, Lockable } from './CargoBike';
import { BikeEventType } from './BikeEventType';
import { Participant } from './Participant';
import { type } from 'os';

@Entity()
export class BikeEvent implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        nullable: false,
        default: ''
    })
    description: string;

    @Column({
        nullable: false,
        default: ''
    })
    remark: string;

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE'
    })
    date: Date;

    @ManyToOne(type => Participant)
    @JoinColumn({
        name: 'responsibleId'
    })
    responsibleId: number;

    @ManyToOne(type => Participant)
    @JoinColumn({
        name: 'relatedId'
    })
    relatedId: number;

    @Column('simple-array', {
        nullable: true
    })
    documents: string[];

    @ManyToOne(type => CargoBike, cargoBike => cargoBike.bikeEvents, {
        nullable: false
    })
    @JoinColumn({
        name: 'cargoBikeId'
    })
    cargoBikeId: number;

    @ManyToOne(type => BikeEventType, {
        nullable: false
    })
    @JoinColumn({
        name: 'bikeEventTypeId'
    })
    bikeEventTypeId: number;

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
