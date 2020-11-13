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

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Participant } from './Participant';
import { WorkshopType } from './WorkshopType';
import { Lockable } from './CargoBike';

@Entity()
export class Workshop implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => WorkshopType, workshopType => workshopType.workshopIds)
    workshopTypeId: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({
        type: 'date'
    })
    date: Date;

    @ManyToMany(type => Participant, participant => participant.workshopIds, {
        nullable: true
    })
    participantIds: number[];

    @ManyToOne(type => Participant, {
        nullable: false
    })
    @JoinColumn({
        name: 'trainer1Id'
    })
    trainer1Id: number;

    @ManyToOne(type => Participant, {
        nullable: true
    })
    @JoinColumn({
        name: 'trainer2Id'
    })
    trainer2: Participant;

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
