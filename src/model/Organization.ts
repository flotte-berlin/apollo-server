import { PrimaryGeneratedColumn, OneToOne, OneToMany, Column, Entity } from 'typeorm';
import { LendingStation } from './LendingStation';
import { Provider } from './Provider';

@Entity()
export class Organization {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => LendingStation, lendingStation => lendingStation.organization)
    lendingStations: LendingStation[];

    @OneToOne(type => Provider, provider => provider.organization, {
        nullable: true
    })
    provider: Provider;

    // Court where association was registerd
    @Column({
        nullable: true
    })
    registerdAt: string;

    @Column({
        nullable: true
    })
    registerNo: string;
}
