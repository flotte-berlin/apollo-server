/* eslint no-unused-vars: 0 */
export enum Permission {
    ReadBike = 'BIKE_READ',
    WriteBike = 'BIKE_WRITE',
}

// Permissions where the creation will be requested on startup
export const requiredPermissions = [
    {
        name: Permission.ReadBike,
        description: 'Allows to read of bike information'
    },
    {
        name: Permission.WriteBike,
        description: 'Allows the modification of bike information'
    }
]
