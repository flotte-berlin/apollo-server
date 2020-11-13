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

import { DataSource } from 'apollo-datasource';
import { Connection, getConnection } from 'typeorm';
import { ActionLog } from '../../model/ActionLog';

export class ActionLogAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    async actionLogByUserId (userId: number) {
        return await this.connection.getRepository(ActionLog)
            .createQueryBuilder('al')
            .select()
            .where('"userId" = :uid', { uid: userId })
            .orderBy('date', 'DESC')
            .getMany();
    }

    async actionLogAll () {
        return await this.connection.getRepository(ActionLog)
            .createQueryBuilder('al')
            .select()
            .orderBy('date', 'DESC')
            .getMany();
    }
}
