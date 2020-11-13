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

import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Lockable } from './CargoBike';
import { Person } from './Person';
import { Address } from './Provider';
import { Participant } from './Participant';

@Entity()
export class ContactInformation implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Person, person => person.contactInformationIds, {
        nullable: false

    })
    @JoinColumn({
        name: 'personId'
    })
    personId: number;

    @OneToOne(type => Participant, participant => participant.contactInformationId, {
        nullable: true
    })
    participantId: number;

    @Column(type => {
        return Address;
    })
    address: Address;

    @Column({
        nullable: true
    })
    phone: string;

    @Column({
        nullable: true
    })
    phone2: string;

    @Column({
        nullable: true
    })
    email: string;

    @Column({
        nullable: true
    })
    email2: string;

    @Column({
        nullable: true
    })
    note: string;

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
