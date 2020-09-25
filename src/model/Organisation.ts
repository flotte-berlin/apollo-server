import { PrimaryGeneratedColumn, OneToOne, OneToMany, Column, Entity } from 'typeorm';
import { LendingStation } from './LendingStation';
import { Address, Provider } from './Provider';

@Entity()
export class Organisation {
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
    registeredAt: string;

    @Column({
        nullable: true
    })
    registerNo: string;

    @Column(type => Address)
    address: Address;
}
