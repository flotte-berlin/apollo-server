/* eslint no-unused-vars: "off" */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, TreeLevelColumn } from 'typeorm';
import { CargoBike } from './CargoBike';
import { BikeEventType } from './BikeEventType';
import { Participant } from './Participant';
import { type } from 'os';

@Entity()
export class BikeEvent {
    public setValues ({ id, remark, date, documents, cargoBike }: { id: number, remark: string, date: Date, documents: string[], cargoBike: CargoBike}): void {
        this.id = id;
        this.remark = remark;
        this.date = date;
        this.documents = documents;
        this.cargoBike = cargoBike;
    }

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
    responsible: Participant;

    @ManyToOne(type => Participant)
    related: Participant;

    @Column('simple-array', {
        nullable: true
    })
    documents: string[];

    @ManyToOne(tpye => CargoBike, cargoBike => cargoBike.bikeEvents, {
        nullable: false
    })
    @JoinColumn({ name: 'cargoBikeId' })
    cargoBike: CargoBike;

    @ManyToOne(type => BikeEventType)
    bikeEventType: BikeEventType;
}
