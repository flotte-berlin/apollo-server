// Response in the form of [valid, ttl]
export type ValidateTokenResponse = [boolean, number]

// Info in the form of [name, binary, description, request_structure][]
export type GetInfoResponse = [string, string, string][]
