/* eslint no-unused-vars: "off" */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum BikeEventType {
    KAUF = 'Kauf',
    INBETRIEBNAHME = 'Inbetriebnahme',
    AUSFALL = 'Ausfall',
    WARTUNG = 'Wartung'
}

@Entity()
export class BikeEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true
    })
    note: string;

    @Column({
        type: 'date'
    })
    date: Date;

    @Column('simple-array', {
        nullable: true
    })
    documents: string[];

    @Column({
        type: 'enum',
        enum: BikeEventType
    })
    eventType: BikeEventType
}
