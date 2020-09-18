/* eslint no-unused-vars: "off" */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CargoBike } from './CargoBike';

export enum BikeEventType {
    KAUF = 'KAUF',
    INBETRIEBNAHME = 'INBETRIEBNAHME',
    AUSFALL = 'AUSFALL',
    WARTUNG = 'WARTUNG',
    ANDERE = 'ANDERE'
}

@Entity()
export class BikeEvent {
    public setValues ({ id, note, date, documents, cargoBike, eventType }: { id: number, note: string, date: Date, documents: string[], cargoBike: CargoBike, eventType: BikeEventType}): void {
        this.id = id;
        this.note = note;
        this.date = date;
        this.documents = documents;
        this.cargoBike = cargoBike;
        this.eventType = eventType;
    }

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

    @ManyToOne(tpye => CargoBike, cargoBike => cargoBike.bikeEvents, {
        nullable: false
    })
    @JoinColumn({ name: 'cargoBikeId' })
    cargoBike: CargoBike;

    @Column({
        type: 'enum',
        enum: BikeEventType
    })
    eventType: BikeEventType
}
