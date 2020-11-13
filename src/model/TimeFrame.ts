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

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { LendingStation } from './LendingStation';
import { CargoBike, Lockable } from './CargoBike';

/**
 * When was a cargoBike at what lendingStation
 */
@Entity()
export class TimeFrame implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'daterange'
    })
    dateRange: Date[];

    @ManyToOne(type => LendingStation, lendingStation => lendingStation.timeFrames, { nullable: false })
    @JoinColumn({
        name: 'lendingStationId'
    })
    lendingStationId: number;

    @Column({
        nullable: true
    })
    note: string;

    @ManyToOne(type => CargoBike, cargoBike => cargoBike.timeFrames, { nullable: false })
    @JoinColumn({
        name: 'cargoBikeId'
    })
    cargoBikeId: number;

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
