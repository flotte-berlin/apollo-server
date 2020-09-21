/* eslint no-unused-vars: "off" */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, TreeLevelColumn } from 'typeorm';
import { CargoBike } from './CargoBike';

export enum BikeEventType {
    KAUF = 'KAUF',
    INBETRIEBNAHME = 'INBETRIEBNAHME',
    AUSFALL = 'AUSFALL',
    WARTUNG = 'WARTUNG',
    KETTENWECHSEL = 'KETTENWECHSEL',
    ANDERE = 'ANDERE'
}

@Entity()
export class BikeEvent {
    public setValues ({ id, remark, date, documents, cargoBike, eventType }: { id: number, remark: string, date: Date, documents: string[], cargoBike: CargoBike, eventType: BikeEventType}): void {
        this.id = id;
        this.remark = remark;
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
    name: string;

    @Column({
        nullable: true
    })
    remark: string;

    @Column({
        type: 'date'
    })
    date: Date;

    @Column({
        nullable: true
    })
    mechanic: string;

    @Column({
        nullable: true
    })
    kexNoOldAXAChain: string;

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
