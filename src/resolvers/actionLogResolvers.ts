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

import { Permission } from '../datasources/userserver/permission';
import { PermissionError } from '../errors/PermissionError';

export default {
    Query: {
        actionLog: (_: any, __:any, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadActionLog)) {
                return dataSources.actionLogAPI.actionLogByUserId(req.userId);
            } else {
                throw new PermissionError();
            }
        },
        actionLogByUser: (_: any, { id }: {id: number}, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadActionLogAll)) {
                return dataSources.actionLogAPI.actionLogByUserId(id);
            } else {
                throw new PermissionError();
            }
        },
        actionLogAll: (_: any, __: any, { dataSources, req }:{dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadActionLogAll)) {
                return dataSources.actionLogAPI.actionLogAll();
            } else {
                throw new PermissionError();
            }
        }
    }
};
