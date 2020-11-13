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
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, TreeLevelColumn } from 'typeorm';
import { CargoBike, Lockable } from './CargoBike';
import { BikeEventType } from './BikeEventType';
import { Participant } from './Participant';
import { type } from 'os';

@Entity()
export class BikeEvent implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        nullable: false,
        default: ''
    })
    description: string;

    @Column({
        nullable: false,
        default: ''
    })
    remark: string;

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE'
    })
    date: Date;

    @ManyToOne(type => Participant)
    @JoinColumn({
        name: 'responsibleId'
    })
    responsibleId: number;

    @ManyToOne(type => Participant)
    @JoinColumn({
        name: 'relatedId'
    })
    relatedId: number;

    @Column('simple-array', {
        nullable: true
    })
    documents: string[];

    @ManyToOne(type => CargoBike, cargoBike => cargoBike.bikeEvents, {
        nullable: false
    })
    @JoinColumn({
        name: 'cargoBikeId'
    })
    cargoBikeId: number;

    @ManyToOne(type => BikeEventType, {
        nullable: false
    })
    @JoinColumn({
        name: 'bikeEventTypeId'
    })
    bikeEventTypeId: number;

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
