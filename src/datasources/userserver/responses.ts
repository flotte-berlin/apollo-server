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

// Response in the form of [valid, ttl]
export type ValidateTokenResponse = [boolean, number]

// Info in the form of [name, binary, description, request_structure][]
export type GetInfoResponse = [string, string, string][]

// Role array in the form of [id, name, description][]
export type GetRolesResponse = [number, string, string][]

// Permissions map where each roleId maps to an array of permissions
export type GetRolesPermissionsResponse = {[id: string]: [number, string, string][]}

export type CreateRoleResponse = [number, string, string]
