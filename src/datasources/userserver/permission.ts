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
    ReadActionLogAll = 'ACTION_LOG_ALL_READ',
    DeleteBike = 'BIKE_DELETE',
    DeleteTimeFrame = 'TIME_FRAME_DELETE',
    DeletePerson = 'PERSON_DELETE',
    DeleteParticipant = ' PARTICIPANT_DELETE',
    DeleteProvider = 'PROVIDER_DELETE',
    DeleteLendingStation = 'LENDING_STATION_DELETE',
    DeleteOrganisation = 'ORGANISATION_DELETE',
    DeleteWorkshop = 'WORKSHOP_DELETE',
    DeleteBikeEvent = 'BIKE_EVENT_DELETE',
    DeleteEngagement = 'ENGAGEMENT_DELETE',
    DeleteEquipment = 'EQUIPMENT_DELETE',
    DeleteWorkshopType = 'WORKSHOP_TYPE_DELETE',
    DeleteEventType = 'EVENT_TYPE_DELETE',
    DeleteEquipmentType = 'EQUIPMENT_TYPE_DELETE',
    DeleteEngagementType = 'ENGAGEMENT_TYPE_DELETE'
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
    },
    {
        name: Permission.DeleteBike,
        description: 'Allows to delete bikes'
    },
    {
        name: Permission.DeleteTimeFrame,
        description: 'Allows to delete time frames'
    },
    {
        name: Permission.DeletePerson,
        description: 'Allows to delete persons and personal data'
    },
    {
        name: Permission.DeleteParticipant,
        description: 'Allows to delete participants'
    },
    {
        name: Permission.DeleteProvider,
        description: 'Allows to delete provider'
    },
    {
        name: Permission.DeleteLendingStation,
        description: 'Allows to delete lending stations'
    },
    {
        name: Permission.DeleteOrganisation,
        description: 'Allows to delete organisations'
    },
    {
        name: Permission.DeleteWorkshop,
        description: 'Allows to delete workshops'
    },
    {
        name: Permission.DeleteBikeEvent,
        description: 'Allows to delete bike events'
    },
    {
        name: Permission.DeleteEngagement,
        description: 'Allows to delete engagements'
    },
    {
        name: Permission.DeleteEquipment,
        description: 'Allows to delete equipment'
    },
    {
        name: Permission.DeleteWorkshopType,
        description: 'Allows to delete workshop types'
    },
    {
        name: Permission.DeleteEventType,
        description: 'Allows to delete event types'
    },
    {
        name: Permission.DeleteEquipmentType,
        description: 'Allows to delete equipment types'
    },
    {
        name: Permission.DeleteEngagementType,
        description: 'Allows to delete engagement types'
    }
];
