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

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ContactInformation } from './ContactInformation';
import { Engagement } from './Engagement';
import { Workshop } from './Workshop';
import { Lockable } from './CargoBike';

@Entity()
export class Participant implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'daterange'
    })
    dateRange: Date[];

    @OneToOne(type => ContactInformation, contactInformation => contactInformation.participantId, {
        nullable: false
    })
    @JoinColumn({
        name: 'contactInformationId'
    })
    contactInformationId: number;

    @Column({
        nullable: true
    })
    usernamefLotte: string;

    @Column({
        nullable: true
    })
    usernameSlack: string;

    @Column({
        type: 'simple-array'
    })
    locationZIPs: string[];

    @OneToMany(type => Engagement, engagement => engagement.participantId)
    engagement: Engagement[];

    @ManyToMany(type => Workshop, workshop => workshop.participantIds, {
        nullable: true
    })
    @JoinTable()
    workshopIds: number[];

    @Column({
        nullable: false,
        default: false
    })
    memberCoreTeam: boolean;

    @Column({
        nullable: false,
        default: false
    })
    employeeADFC: boolean;

    @Column({
        nullable: false,
        default: false
    })
    memberADFC: boolean;

    @Column({
        nullable: true,
    })
    comment: string;

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
