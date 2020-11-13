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

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { TimeFrame } from './TimeFrame';
import { Organisation } from './Organisation';
import { Address } from './Provider';
import { ContactInformation } from './ContactInformation';
import { Lockable } from './CargoBike';

export class LoanPeriod {
    /**
     * validity for loanPeriods
     */
    @Column({
        nullable: true,
        type: 'date'
    })
    from: Date;

    /**
     * validity for loanPeriods
     */
    @Column({
        nullable: true,
        type: 'date'
    })
    to: Date;

    @Column({
        type: 'simple-array',
        nullable: true
    })
    loanTimes: string[];
}

@Entity()
export class LendingStation implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => ContactInformation)
    @JoinColumn({
        name: 'contactInformationInternId'
    })
    contactInformationInternId: number;

    @ManyToOne(type => ContactInformation)
    @JoinColumn({
        name: 'contactInformationExternId'
    })
    contactInformationExternId: number;

    @Column(type => Address)
    address: Address;

    @Column(type => LoanPeriod)
    loanPeriod: LoanPeriod;

    @OneToMany(type => TimeFrame, timeFrame => timeFrame.lendingStationId)
    timeFrames: TimeFrame[];

    @ManyToOne(type => Organisation, organization => organization.lendingStations)
    @JoinColumn({
        name: 'organisationId'
    })
    organisationId: number;

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
