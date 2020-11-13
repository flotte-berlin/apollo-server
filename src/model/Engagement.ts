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

import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Participant } from './Participant';
import { CargoBike, Lockable } from './CargoBike';
import { EngagementType } from './EngagementType';

@Entity()
export class Engagement implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Participant, participant => participant.engagement, {
        nullable: false
    })
    @JoinColumn({
        name: 'participantId'
    })
    participantId: number;

    @ManyToOne(type => CargoBike, cargoBike => cargoBike.engagement, {
        nullable: false
    })
    @JoinColumn({
        name: 'cargoBikeId'
    })
    cargoBikeId: number;

    @ManyToOne(type => EngagementType, engagementType => engagementType.engagementIds, {
        nullable: false
    })
    @JoinColumn({
        name: 'engagementTypeId'
    })
    engagementTypeId: number;

    // I have to find out how typorm will map the datetange data type.
    @Column({
        type: 'daterange',
        default: () => 'daterange(CURRENT_DATE,\'infinity\',\'[)\')'
    })
    dateRange: Date[];

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
