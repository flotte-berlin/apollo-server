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

import { Column } from 'typeorm';

export class InsuranceData {
    @Column()
    name: string;

    @Column()
    benefactor: string;

    @Column()
    billing: string;

    @Column()
    noPnP: string;

    @Column()
    maintenanceResponsible: string;

    @Column()
    maintenanceBenefactor: string;

    @Column({
        nullable: true
    })
    maintenanceAgreement: string;

    @Column({
        nullable: true
    })
    hasFixedRate: boolean;

    @Column({
        nullable: true
    })
    fixedRate: number;

    @Column({
        type: 'money',
        nullable: true
    })
    projectAllowance: number;

    @Column({
        nullable: true
    })
    notes: string;
}
