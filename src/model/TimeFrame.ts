import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { LendingStation } from './LendingStation';
import { CargoBike } from './CargoBike';

/**
 * When was a cargoBike at what lendingStation
 */
@Entity()
export class TimeFrame {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'daterange'
    })
    dateRange: Date[];

    @ManyToOne(type => LendingStation, lendingStation => lendingStation.timeFrames)
    lendingStation: LendingStation;

    @Column({
        nullable: true
    })
    note: string;

    @ManyToOne(type => CargoBike, cargoBike => cargoBike.timeFrames)
    cargoBike: CargoBike;
}
