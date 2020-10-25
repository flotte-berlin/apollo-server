import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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

    @ManyToOne(type => LendingStation, lendingStation => lendingStation.timeFrames, { nullable: false })
    @JoinColumn({
        name: 'lendingStationId'
    })
    lendingStationId: number;

    @Column({
        nullable: true
    })
    note: string;

    @ManyToOne(type => CargoBike, cargoBike => cargoBike.timeFrames, { nullable: false })
    @JoinColumn({
        name: 'cargoBikeId'
    })
    cargoBikeId: number;

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
