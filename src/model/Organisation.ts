import { PrimaryGeneratedColumn, OneToOne, OneToMany, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { LendingStation } from './LendingStation';
import { Address, Provider } from './Provider';
import { ContactInformation } from './ContactInformation';
import { Lockable } from './CargoBike';

@Entity()
export class Organisation implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => LendingStation, lendingStation => lendingStation.organisationId)
    lendingStations: LendingStation[];

    @OneToOne(type => Provider, provider => provider.organisationId, {
        nullable: true
    })
    providerId: number;

    @ManyToOne(type => ContactInformation)
    @JoinColumn({
        name: 'contactInformationId'
    })
    contactInformationId: number;

    // Court where association was registered
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
