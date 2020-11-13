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

import { Lockable } from './CargoBike';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Workshop } from './Workshop';

@Entity()
export class WorkshopType implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Workshop, workshop => workshop.workshopTypeId)
    workshopIds: number[];

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
