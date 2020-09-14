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

    @Column()
    note: string;

    @Column('simple-array')
    documents: string[];

    @Column({
        type: 'enum',
        enum: BikeEventType
    })
    type: BikeEventType

    @Column()
    otherEquipment: string;
}
