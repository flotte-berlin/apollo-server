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

/* eslint no-unused-vars: "off" */

import { PrimaryGeneratedColumn, Column, OneToMany, Entity, OneToOne, ChildEntity, ManyToOne, JoinColumn } from 'typeorm';
import { CargoBike, Lockable } from './CargoBike';
import { ContactInformation } from './ContactInformation';
import { Organisation } from './Organisation';

export class Address {
    @Column({
        default: ''
    })
    street: string;

    @Column({
        default: ''
    })
    number: string;

    @Column({
        default: ''
    })
    zip: string;

    @Column({
        default: ''
    })
    city: string;
}

@Entity()
export class Provider implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    formName: String;

    // is null when Provider is an organisation
    @OneToOne(type => ContactInformation, {
        nullable: true
    })
    @JoinColumn({
        name: 'privatePersonId'
    })
    privatePersonId: number;

    // is null when Provider is a private Person
    @OneToOne(type => Organisation, organization => organization.providerId, {
        nullable: true
    })
    @JoinColumn({
        name: 'organisationId'
    })
    organisationId: number;

    @OneToMany(type => CargoBike, cargoBike => cargoBike.providerId)
    cargoBikeIds: number[];

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
