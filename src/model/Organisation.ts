/*
Copyright (C) 2020  Leon Löchner

This file is part of fLotte-API-Server.

    fLotte-API-Server is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    fLotte-API-Server is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with fLotte-API-Server.  If not, see <https://www.gnu.org/licenses/>.
*/

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
    associationNo: string;

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
