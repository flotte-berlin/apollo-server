import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { LendingStation } from './LendingStation';
import { CargoBike, Lockable } from './CargoBike';

/**
 * When was a cargoBike at what lendingStation
 */
@Entity()
export class TimeFrame implements Lockable {
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
