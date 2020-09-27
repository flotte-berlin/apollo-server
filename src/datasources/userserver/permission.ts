/* eslint no-unused-vars: 0 */
export enum Permission {
    ReadBike = 'BIKE_READ',
    WriteBike = 'BIKE_WRITE',
    WriteEquipmentType = 'EQUIPMENT_TYPE_WRITE',
    WritePerson = 'PERSON_WRITE',
    ReadPerson = 'PERSON_READ'
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
    },
    {
        name: Permission.WriteEquipmentType,
        description: 'Allows the modification of EquipmentTypes'
    },
    {
        name: Permission.WritePerson,
        description: 'Allows the modification of Persons and contact information'
    },
    {
        name: Permission.ReadPerson,
        description: 'Allows reading of contact information'
    }
];
