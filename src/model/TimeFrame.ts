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

    // I have to find out how typorm will map the datetange data type.
    @Column({
        type: 'daterange'
    })
    dateRange: Date[];

    @ManyToOne(type => LendingStation, lendingStation => lendingStation.loanPeriods)
    lendingStation: LendingStation;

    @Column({
        nullable: true
    })
    note: string;

    @ManyToOne(type => CargoBike, cargoBike => cargoBike.loanPeriods)
    cargoBike: CargoBike;
}
