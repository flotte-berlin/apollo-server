/* eslint no-unused-vars: 0 */
export enum Permission {
    ReadBike = 'BIKE_READ',
    WriteBike = 'BIKE_WRITE',
    ReadTimeFrame = 'TIME_FRAME_READ',
    WriteTimeFrame = 'TIMEFRAME_WRITE',
    ReadPerson = 'PERSON_READ',
    WritePerson = 'PERSON_WRITE',
    ReadParticipant = 'PARTICIPANT_READ',
    WriteParticipant = 'PARTICIPANT_WRITE',
    ReadProvider = 'PROVIDER_READ',
    WriteProvider = 'PROVIDER_WRITE',
    ReadLendingStation = 'LENDING_STATION_READ',
    WriteLendingStation = 'LENDING_STATION_WRITE',
    ReadOrganisation = 'ORGANISATION_READ',
    WriteOrganisation = 'ORGANISATION_WRITE',
    ReadWorkshop = 'WORKSHOP_READ',
    WriteWorkshop = 'WORKSHOP_WRITE',
    ReadBikeEvent = 'BIKE_EVENT_READ',
    WriteBikeEvent = 'BIKE_EVENT_WRITE',
    ReadEngagement = 'ENGAGEMENT_READ',
    WriteEngagement = 'ENGAGEMENT_WRITE',
    ReadEquipment = 'EQUIPMENT_READ',
    WriteEquipment = 'EQUIPMENT_WRITE',
    WriteWorkshopType = 'WORKSHOP_TYPE_WRITE',
    WriteEventType = 'BIKE_EVENT_TYPE_WRITE',
    WriteEquipmentType = 'EQUIPMENT_TYPE_WRITE',
    WriteEngagementType = 'ENGAGEMENT_TYPE_WRITE',
    ReadActionLog = 'ACTION_LOG_READ',
    ReadActionLogAll = 'ACTION_LOG_ALL_READ'
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
        name: Permission.WriteTimeFrame,
        description: 'Allows to write timeframes'
    },
    {
        name: Permission.ReadTimeFrame,
        description: 'Allows to read time frames'
    },
    {
        name: Permission.WriteEquipmentType,
        description: 'Allows the modification of EquipmentTypes'
    },
    {
        name: Permission.ReadPerson,
        description: 'Allows reading of contact information'
    },
    {
        name: Permission.WritePerson,
        description: 'Allows the modification of Persons and contact information'
    },
    {
        name: Permission.ReadParticipant,
        description: 'Allows to read participants'
    },
    {
        name: Permission.WriteParticipant,
        description: 'Allows to write and create participants'
    },
    {
        name: Permission.ReadProvider,
        description: 'Allows to read providers'
    },
    {
        name: Permission.WriteProvider,
        description: 'Allows to modify providers and organisations'
    },
    {
        name: Permission.ReadLendingStation,
        description: 'Allows to read lending stations'
    },
    {
        name: Permission.WriteLendingStation,
        description: 'Allows to write and create lending stations'
    },
    {
        name: Permission.ReadOrganisation,
        description: 'Allows to read organisation data'
    },
    {
        name: Permission.WriteOrganisation,
        description: 'Allows write and create organisations'
    },
    {
        name: Permission.ReadWorkshop,
        description: 'Allows to read workshops and workshop types'
    },
    {
        name: Permission.WriteWorkshop,
        description: 'Allows to write and create workshops'
    },
    {
        name: Permission.ReadBikeEvent,
        description: 'Allows to read bike events'
    },
    {
        name: Permission.WriteBikeEvent,
        description: 'Allows to write and create bike events'
    },
    {
        name: Permission.ReadEngagement,
        description: 'Allows to read engagements'
    },
    {
        name: Permission.WriteEngagement,
        description: 'Allows to write and create engagements'
    },
    {
        name: Permission.ReadEquipment,
        description: 'Allows to read equipment'
    },
    {
        name: Permission.WriteEquipment,
        description: 'Allows to write and create equipment'
    },
    {
        name: Permission.WriteWorkshopType,
        description: 'Allows to create and modify workshop types'
    },
    {
        name: Permission.WriteEventType,
        description: 'Allows modification of bike event types'
    },
    {
        name: Permission.WriteEngagementType,
        description: 'Allows to write and create engagement types'
    },
    {
        name: Permission.ReadActionLog,
        description: 'Allows to read own action log'
    },
    {
        name: Permission.ReadActionLogAll,
        description: 'Allows to read action log of other users'
    }
];
