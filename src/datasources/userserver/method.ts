/*
Copyright (C) 2020  trivernis

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

/* eslint no-unused-vars: 0 */
export enum Method {
    Null = 0x00,
    Error = 0x0F_0F_0F_0F,
    Info = 0x49_4e_46_4f,
    ValidateToken = 0x56_41_4c_49,
    GetRoles = 0x52_4f_4c_45,
    GetRolePermissions = 0x50_45_52_4d,
    CreateRole = 0x43_52_4f_4c,
    CreatePermissions = 0x43_50_45_52,
    GetUserID = 0x55534552
}
