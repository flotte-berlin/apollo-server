// Response in the form of [valid, ttl]
export type ValidateTokenResponse = [boolean, number]

// Info in the form of [name, binary, description, request_structure][]
export type GetInfoResponse = [string, string, string][]

// Role array in the form of [id, name, description][]
export type GetRolesResponse = [number, string, string][]

// Permissions map where each roleId maps to an array of permissions
export type GetRolesPermissionsResponse = {[id: string]: [number, string, string][]}

export type CreateRoleResponse = [number, string, string]
