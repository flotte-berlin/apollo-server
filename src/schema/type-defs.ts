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

import { gql } from 'apollo-server-express';

export default gql`

    "timestamp object YYYY-MM-ddThh:mm:ss.sssZ"
    scalar Date
    "only time hh-mm-ss"
    scalar Time
    """
    is of american format [-]$[0-9]+.[0-9][0-9]
    commas every three digits and . for decimals with 2 digits after the .
    There can be a leading  -.
    There is a currency signe at the first position or second position if - is set.
    The kind of currency depends on the database.
    """
    scalar Money
    
    "The CargoBike type is central to the graph. You could call it the root."
    type CargoBike {
        id: ID!
        "see column A in info tabelle"
        group: Group
        name: String!
        state: BikeState
        modelName: String
        numberOfWheels: Int
        forCargo: Boolean
        forChildren: Boolean
        numberOfChildren: Int
        """
        Safety is a custom type, that stores information about security features.
        TODO: Should this be called Security?
        """
        security: Security
        """
        Does not refer to an extra table in the database.
        """
        technicalEquipment: TechnicalEquipment
        """
        Does not refer to an extra table in the database.
        """
        dimensionsAndLoad: DimensionsAndLoad
        "If offset or limit is not provided, both values are ignored"
        bikeEvents(offset: Int, limit: Int): [BikeEvent]
        "If offset or limit is not provided, both values are ignored"
        equipment(offset: Int, limit: Int): [Equipment]
        "Refers to equipment that is not unique. See kommentierte info tabelle -> Fragen -> Frage 2"
        equipmentType: [EquipmentType]
        "Sticker State"
        stickerBikeNameState: StickerBikeNameState
        note: String
        provider: Provider
        "all participants currently engaged with the cargoBike"
        participants:  [Participant]
        insuranceData: InsuranceData
        lendingStation: LendingStation
        taxes: Taxes
        currentEngagements: [Engagement]
        "If offset or limit is not provided, both values are ignored"
        engagement(offset: Int, limit: Int): [Engagement]
        timeFrames: [TimeFrame]
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    """
    Status of the CargoBike. More fields will be added, or removed.
    """
    enum BikeState {
        ACTIVE
        INACTIVE
        INPREPARATION
    }
    
    """
    if you want to add bike to a lending station, create a new timeFrame with to: Date = null
    """
    input CargoBikeCreateInput {
        "see column A in info tabelle"
        group: Group!
        name: String!
        state: BikeState
        modelName: String
        numberOfWheels: Int
        forCargo: Boolean
        forChildren: Boolean
        numberOfChildren: Int
        """
        Safety is a custom type, that stores information about security features.
        """
        security: SecurityCreateInput
        """
        Does not refer to an extra table in the database.
        """
        technicalEquipment: TechnicalEquipmentCreateInput
        """
        Does not refer to an extra table in the database.
        """
        dimensionsAndLoad: DimensionsAndLoadCreateInput
        """
        Refers to equipment that is not unique. See kommentierte info tabelle -> Fragen -> Frage 2
        When set to null or [], no relations will be added.
        """
        equipmentTypeIds: [ID]
        """
        Refers to unique equipment
        When set to null or [], no relations will be added.
        When specified id is in a relation with another bike, this relation will be deleted.
        """
        equipmentIds: [ID]
        "Sticker State"
        stickerBikeNameState: StickerBikeNameState
        note: String
        providerId: ID
        insuranceData: InsuranceDataCreateInput
        taxes: TaxesCreateInput
    }

    """
    If you want to add bike to a lending station, create a new timeFrame with to: Date = null
    """
    input CargoBikeUpdateInput {
        id: ID!
        "see column A in info tabelle"
        group: Group
        name: String
        state: BikeState
        modelName: String
        numberOfWheels: Int
        forCargo: Boolean
        forChildren: Boolean
        numberOfChildren: Int
        """
        Safety is a custom type, that stores information about security features.
        """
        security: SecurityUpdateInput
        """
        Does not refer to an extra table in the database.
        """
        technicalEquipment: TechnicalEquipmentUpdateInput
        """
        Does not refer to an extra table in the database.
        """
        dimensionsAndLoad: DimensionsAndLoadUpdateInput
        """
        Refers to equipment that is not unique. See kommentierte info tabelle -> Fragen -> Frage 2
        When set to null, field will be ignored.
        When set to [], all relations will be deleted.
        Else all realtions will be deleted and the specified relations will be added.
        """
        equipmentTypeIds: [ID]
        """
        Refers to unique equipment
        When set to null, field will be ignored.
        When set to [], all relations will be deleted.
        Else all realtions will be deleted and the specified relations will be added.
        When specified id is in a relation with another bike, this relation will be deleted.
        """
        equipmentIds: [ID]
        "Sticker State"
        stickerBikeNameState: StickerBikeNameState
        note: String
        providerId: ID
        insuranceData: InsuranceDataUpdateInput
        taxes: TaxesUpdateInput
        "will keep Bike locked if set to true, default = false"
        keepLock: Boolean
    }

    type InsuranceData {
        """
        Eventually, this field will become an enum or a separate data table and user can choose from a pool of insurance companies.
        """
        name: String
        benefactor: String
        billing: String
        noPnP: String
        "eg. Anbieter, flotte, eigenleistung"
        maintenanceResponsible: String
        maintenanceBenefactor: String
        maintenanceAgreement: String
        hasFixedRate: Boolean
        fixedRate: Float
        """
        Projektzuschuss:
        is of american format [-]$[0-9]+.[0-9][0-9]
        commas every three digits and . for decimals with 2 digits after the .
        There can be a leading  -.
        There is a currency signe at the first position or second position if - is set.
        The kind of currency depends on the database.
        """
        projectAllowance: Money
        notes: String
    }

    input InsuranceDataCreateInput {
        """
        Eventually, this field will become an enum or a separate data table and user can choose from a pool of insurance companies.
        """
        name: String
        benefactor: String
        billing: String
        noPnP: String
        "eg. Anbieter, flotte, eigenleistung"
        maintenanceResponsible: String
        maintenanceBenefactor: String
        maintenanceAgreement: String
        hasFixedRate: Boolean
        fixedRate: Float
        """
        Projektzuschuss:
        must be of format [+|-][$][0-9]*[.[0-9]*]
        commas are ignored, non numeric values except , and . lead to errors
        There can be a leading + or -.
        You can pass a currency signe at the first position or second position of + or - is set.
        The kind of currency depends on the database.
        """
        projectAllowance: Money
        notes: String
    }

    input InsuranceDataUpdateInput {
        """
        Eventually, this field will become an enum or a separate data table and user can choose from a pool of insurance companies.
        """
        name: String
        benefactor: String
        billing: String
        noPnP: String
        "eg. Anbieter, flotte, eigenleistung"
        maintenanceResponsible: String
        maintenanceBenefactor: String
        maintenanceAgreement: String
        hasFixedRate: Boolean
        fixedRate: Float
        """
        Projektzuschuss:
        must be of format [+|-][$][0-9]*[.[0-9]*]
        commas are ignored, non numeric values except , and . lead to errors
        There can be a leading + or -.
        You can pass a currency signe at the first position or second position of + or - is set.
        The kind of currency depends on the database.
        """
        projectAllowance: Money
        notes: String
    }

    type NumRange {
        min: Float
        max: Float
    }
    
    """
    If min or max is omitted, the omitted value will be the same as the other given value
    So if you pass one as null, both values with be over written with null.
    """
    input NumRangeInput {
        min: Float
        max: Float
    }
    
    "How are the dimensions and how much weight can handle a bike. This data is merged in the CargoBike table and the BikeModel table."
    type DimensionsAndLoad {
        hasCoverBox: Boolean
        "cover box can be locked"
        lockable: Boolean
        boxLengthRange: NumRange
        boxWidthRange: NumRange
        boxHeightRange: NumRange
        maxWeightBox: Float
        maxWeightLuggageRack: Float
        maxWeightTotal: Float
        bikeLength: Float
        bikeWidth: Float
        bikeHeight: Float
        bikeWeight: Float
    }

    input DimensionsAndLoadCreateInput {
        hasCoverBox: Boolean
        lockable: Boolean
        boxLengthRange: NumRangeInput
        boxWidthRange: NumRangeInput
        boxHeightRange: NumRangeInput
        maxWeightBox: Float
        maxWeightLuggageRack: Float
        maxWeightTotal: Float
        bikeLength: Float
        bikeWidth: Float
        bikeHeight: Float
        bikeWeight: Float
    }

    input DimensionsAndLoadUpdateInput {
        hasCoverBox: Boolean
        lockable: Boolean
        boxLengthRange: NumRangeInput
        boxWidthRange: NumRangeInput
        boxHeightRange: NumRangeInput
        maxWeightBox: Float
        maxWeightLuggageRack: Float
        maxWeightTotal: Float
        bikeLength: Float
        bikeWidth: Float
        bikeHeight: Float
        bikeWeight: Float
    }

    """
    Some Technical Info about the bike.
    This should be 1-1 Relation with the CargoBike.
    So no id needed for mutation. One Mutation for the CargoBike will be enough.
    """
    type TechnicalEquipment {
        bicycleShift: String
        isEBike: Boolean
        hasLightSystem: Boolean
        specialFeatures: String
    }

    input TechnicalEquipmentCreateInput {
        bicycleShift: String
        isEBike: Boolean
        hasLightSystem: Boolean
        specialFeatures: String
    }

    input TechnicalEquipmentUpdateInput {
        bicycleShift: String
        isEBike: Boolean
        hasLightSystem: Boolean
        specialFeatures: String
    }

    """
    The Security Info about the bike.
    his should be 1-1 Relation with the CargoBike.
    So no id needed for mutation. One Mutation for the CargoBike will be enough.
    """
    type Security {
        frameNumber: String
        keyNumberFrameLock: String
        keyNumberAXAChain: String
        policeCoding: String
        adfcCoding: String
    }

    input SecurityCreateInput {
        frameNumber: String
        keyNumberFrameLock: String
        keyNumberAXAChain: String
        policeCoding: String
        adfcCoding: String
    }

    input SecurityUpdateInput {
        frameNumber: String
        keyNumberFrameLock: String
        keyNumberAXAChain: String
        policeCoding: String
        adfcCoding: String
    }

    enum StickerBikeNameState {
        OK
        IMPROVE
        PRODUCED
        NONEED
        MISSING
        UNKNOWN
    }

    enum Group{
        KL
        LI
        SP
        FK
        MH
        SZ
        TS
        TK
    }

    """
    A participant in the organization
    """
    type Participant {
        id: ID!
        start: Date!
        end: Date
        contactInformation: ContactInformation!
        usernamefLotte: String
        usernameSlack: String
        memberADFC: Boolean!
        locationZIPs: [String]!
        memberCoreTeam: Boolean!
        """
        Note the kommentierte Infodaten Tabelle.
        This value is calculated form other values.
        It is true, if the person is not on the black list and not retired
        and is either Mentor dt. Pate or Partner Mentor dt. Partnerpate for at least one bike.
        """
        distributedActiveBikeParte: Boolean!
        engagement: [Engagement]
        workshops: [Workshop]
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    input ParticipantCreateInput {
        "if not set, CURRENT_DATE will be used"
        start: Date
        end: Date
        "must create contactinformation first, if you want to use new"
        contactInformationId: ID!
        usernamefLotte: String
        usernameSlack: String
        "default: false"
        memberADFC: Boolean!
        locationZIPs: [String]!
        "default: false"
        memberCoreTeam: Boolean
        workshopIds: [ID]
    }

    input ParticipantUpdateInput {
        id: ID!
        "if not set, CURRENT_DATE will be used"
        start: Date
        end: Date
        "must create contactinformation first, if you want to use new"
        contactInformationId: ID
        usernamefLotte: String
        usernameSlack: String
        "default: false"
        memberADFC: Boolean
        locationZIPs: [String]
        "default: false"
        memberCoreTeam: Boolean
        workshopIds: [ID]
        keepLock: Boolean
    }

    """
    A workshop event
    """
    type Workshop {
        id: ID!
        title: String!
        description: String!
        date: Date!
        workshopType: WorkshopType!
        trainer1: Participant!
        trainer2: Participant
        participants: [Participant]
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    input WorkshopCreateInput {
        title: String!
        description: String
        date: Date!
        workshopTypeId: ID!
        trainer1Id: ID!
        trainer2Id: ID
    }

    input WorkshopUpdateInput {
        id: ID!
        title: String
        description: String
        date: Date!
        workshopTypeId: ID
        trainer1Id: ID
        trainer2Id: ID
        keepLock: Boolean
    }

    type WorkshopType {
        id: ID!
        name: String!
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    input WorkshopTypeCreateInput {
        name: String!
    }

    input WorkshopTypeUpdateInput {
        id: ID!
        name: String
    }

    type EngagementType {
        id: ID!
        name: String!
        description: String!
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    input EngagementTypeCreateInput {
        name: String!
        description: String
    }

    input EngagementTypeUpdateInput {
        id: ID!
        name: String
        description: String
        keepLock: Boolean
    }

    type Engagement {
        id: ID!
        engagementType: EngagementType!
        dateRange: DateRange!
        participant: Participant!
        cargoBike: CargoBike!
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    input EngagementCreateInput {
        engagementTypeId: ID!
        dateRange: DateRangeInput
        participantId: ID!
        cargoBikeId: ID!
    }
    input EngagementUpdateInput {
        id: ID!
        engagementTypeId: ID
        dateRange: DateRangeInput
        participantId: ID
        cargoBikeId: ID
        keepLock: Boolean
    }

    type Taxes {
        costCenter: String
        organisationArea: OrganisationArea
    }

    input TaxesCreateInput {
        costCenter: String
        organisationArea: OrganisationArea
    }

    input TaxesUpdateInput {
        costCenter: String
        organisationArea: OrganisationArea
    }

    enum OrganisationArea {
        IB
        ZB
    }

    """
    This type represents a piece of equipment that represents a real physical object.
    The object must be unique. So it is possible to tell it apart from similar objects by a serial number.
    """
    type Equipment {
        id: ID!
        serialNo: String!
        title: String!
        description: String
        cargoBike: CargoBike
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    input EquipmentCreateInput {
        serialNo: String!
        title: String!
        description: String
        cargoBikeId: ID
    }

    input EquipmentUpdateInput {
        id: ID!
        serialNo: String
        title: String
        description: String
        cargoBikeId: ID
        "will keep Bike locked if set to true, default = false"
        keepLock: Boolean
    }

    """
    A type of equipment that is not being tracked but can be assigned
    to any bike.
    """
    type EquipmentType {
        id: ID!
        name: String!
        description: String!
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    input EquipmentTypeCreateInput {
        name: String!
        description: String
    }

    input EquipmentTypeUpdateInput {
        id: ID!
        name: String
        description: String
        keepLock: Boolean
    }

    "An Event is a point in time concerning one cargo bike of an event type. For example a chain swap."
    type BikeEvent {
        id: ID!
        bikeEventType: BikeEventType!
        cargoBike: CargoBike!
        responsible: Participant
        related: Participant
        date: Date!
        description: String
        """
        Path to documents
        """
        documents: [String!]!
        remark: String
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    input BikeEventCreateInput {
        bikeEventTypeId: ID!
        cargoBikeId: ID!
        responsibleId: ID
        relatedId: ID
        date: Date!
        description: String
        """
        Path to documents
        """
        documents: [String]
        remark: String
    }

    input BikeEventUpdateInput {
        id: ID!
        bikeEventTypeId: ID
        cargoBikeId: ID
        responsibleId: ID
        relatedId: ID
        date: Date
        description: String
        """
        Path to documents
        """
        documents: [String]
        remark: String
        keepLock: Boolean
    }

    type BikeEventType {
        id: ID!
        name: String!
        isLockedByMe: Boolean!
        isLocked: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    input BikeEventTypeUpdateInput {
        id: ID!
        name: String
        keepLock: Boolean
    }

    "(dt. Anbieter) bezieht sich auf die Beziehung einer Person oder Organisation zum Lastenrad"
    type Provider {
        id: ID!
        formName: String
        privatePerson: ContactInformation
        organisation: Organisation
        cargoBikes: [CargoBike!]
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    "(dt. Anbieter)"
    input ProviderCreateInput {
        formName: String!
        privatePersonId: ID
        organisationId: ID
        cargoBikeIds: [ID!]
    }

    input ProviderUpdateInput {
        id: ID!
        formName: String
        privatePersonId: ID
        organisationId: ID
        "cargoBikes are added, you can not take existing relations away. use update cargoBike or add bike to another provider instead"
        cargoBikeIds: [ID]
        keepLock: Boolean
    }

    """
    A Person can have several instances of contact information.
    The reason for this is, that some people have info for interns and externals that are different.
    """
    type Person {
        id: ID!
        name: String!
        firstName: String!
        contactInformation: [ContactInformation!]
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    input PersonCreateInput {
        name: String!
        firstName: String!
    }

    input PersonUpdateInput {
        id: ID!
        name: String
        firstName: String
        keepLock: Boolean
    }

    type ContactInformation {
        id: ID!
        person: Person!
        phone: String
        phone2: String
        email: String
        email2: String
        note: String
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    input ContactInformationCreateInput {
        personId: ID!
        phone: String
        phone2: String
        email: String
        email2: String
        note: String
    }

    input ContactInformationUpdateInput {
        id: ID!
        personId: ID
        phone: String
        phone2: String
        email: String
        email2: String
        note: String
        keepLock: Boolean
    }

    type Organisation {
        id: ID!
        name: String!
        address: Address
        "(dt. Ausleihstation)"
        lendingStations: [LendingStation!]
        "registration number of association"
        associationNo: String
        "If Club, at what court registered"
        registeredAt: String
        provider: Provider
        contactInformation: ContactInformation
        otherData: String
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    input OrganisationCreateInput {
        address: AddressCreateInput!
        name: String!
        "registration number of association"
        associationNo: String!
        "If Club, at what court registered"
        registeredAt: String
        contactInformationId: ID
        otherData: String
    }

    input OrganisationUpdateInput {
        id: ID!
        address: AddressCreateInput
        name: String
        "registration number of association"
        associationNo: String
        "If Club, at what court registered"
        registeredAt: String
        contactInformationId: ID
        otherData: String
        keepLock: Boolean
    }

    "(dt. Standort)"
    type LendingStation {
        id: ID!
        name: String!
        contactInformationIntern: ContactInformation
        contactInformationExtern: ContactInformation
        address: Address!
        timeFrames: [TimeFrame!]!
        loanPeriod: LoanPeriod
        cargoBikes: [CargoBike!]
        "Total amount of cargoBikes currently assigned to the lending station"
        numCargoBikes: Int!
        organisation: Organisation
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    """
    If you want to create LendingStation with cargoBikes, use createTimeFrame and set to: Date = null
    """
    input LendingStationCreateInput {
        name: String!
        contactInformationInternId: ID
        contactInformationExternId: ID
        address: AddressCreateInput!
        loanPeriod: LoanPeriodInput
        organisationId: ID
    }

    """
    If you want to create LendingStation with cargoBikes, use createTimeFrame and set to: Date = null
    """
    input LendingStationUpdateInput {
        id: ID!
        name: String
        contactInformationInternId: ID
        contactInformationExternId: ID
        address: AddressUpdateInput
        loanPeriod: LoanPeriodInput
        organisationId: ID
        keepLock: Boolean
    }

    """
    (dt. Ausleihzeiten) not implemented
    """
    type LoanPeriod {
        generalRemark: String
        "notes for each day of the week, starting on Monday"
        notes: [String]
        """
        Loan times from and until for each day of the week.
        Starting with Monday from, Monday to, Tuesday from, ..., Sunday to
        """
        loanTimes: [String]
    }

    """
    (dt. Ausleihzeiten)
    """
    input LoanPeriodInput {
        generalRemark: String
        "notes for each day of the week, starting on Monday"
        notes: [String!]
        """
        Loan times from and until for each day of the week.
        Starting with Monday from, Monday to, Tuesday from, ..., Sunday to
        """
        loanTimes: [String!]
    }

    type DateRange{
        from: Date!
        "will be infinity of not omitted"
        to: Date
    }
    
    input DateRangeInput {
        "format YYYY-MM-dd"
        from: Date!
        """
        format YYYY-MM-dd
        will be infinity of not omitted
        """
        to: Date
    }
    
    "(dt. Zeitscheibe) When was a bike where"
    type TimeFrame {
        id: ID!
        dateRange: DateRange!
        note: String
        lendingStation: LendingStation!
        cargoBike: CargoBike!
        isLocked: Boolean!
        isLockedByMe: Boolean!
        "null if not locked by other user"
        lockedBy: ID
        lockedUntil: Date
    }

    input TimeFrameCreateInput {
        dateRange: DateRangeInput!
        note: String
        lendingStationId: ID!
        cargoBikeId: ID!
    }

    input TimeFrameUpdateInput {
        id: ID!
        dateRange: DateRangeInput
        note: String
        lendingStationId: ID
        cargoBikeId: ID
        keepLock: Boolean
    }

    type Address {
        street: String!
        number: String!
        zip: String!
    }

    input AddressCreateInput {
        street: String!
        number: String!
        zip: String!
    }

    input AddressUpdateInput {
        street: String
        number: String
        zip: String
    }

    type ActionLog {
        id: ID!
        userId: ID!
        date: Date!
        action: String!
        entity: String!
        "in json format"
        entriesOld: String!
        "in json format"
        entriesNew: String!
    }

    type Query {
        "Will (eventually) return all properties of cargo bike"
        cargoBikeById(id:ID!): CargoBike
        "Returns cargoBikes ordered by name ascending. If offset or limit is not provided, both values are ignored."
        cargoBikes(offset: Int, limit: Int): [CargoBike!]!
        engagementById(id: ID!): Engagement
        "If offset or limit is not provided, both values are ignored"
        engagements(offset: Int, limit: Int): [Engagement!]!
        engagementTypeById(id: ID!): EngagementType
        "If offset or limit is not provided, both values are ignored"
        engagementTypes(offset: Int, limit: Int): [EngagementType!]!
        "equipment by id, will return null if id not found"
        equipmentById(id: ID!): Equipment
        "If offset or limit is not provided, both values are ignored"
        equipment(offset: Int, limit: Int): [Equipment!]!
        equipmentTypeById(id: ID!): EquipmentType
        "If offset or limit is not provided, both values are ignored"
        equipmentTypes(offset: Int, limit: Int): [EquipmentType!]!
        "return null if id not found"
        providerById(id:ID!): Provider
        "Returns providers with pagination. If offset or limit is not provided, both values are ignored"
        providers(offset: Int, limit: Int): [Provider!]!
        "participant by id"
        participantById(id:ID!):  Participant
        "If offset or limit is not provided, both values are ignored"
        participants(offset: Int, limit: Int): [Participant!]!
        workshopTypeById(id: ID!): WorkshopType
        "If offset or limit is not provided, both values are ignored"
        workshopTypes(offset: Int, limit: Int): [WorkshopType!]!
        workshopById(id: ID!): Workshop
        "If offset or limit is not provided, both values are ignored"
        workshops(offset: Int, limit: Int): [Workshop!]!
        lendingStationById(id:ID!): LendingStation
        "If offset or limit is not provided, both values are ignored"
        lendingStations(offset: Int, limit: Int): [LendingStation!]!
        organisationById(id: ID!): Organisation
        "If offset or limit is not provided, both values are ignored"
        organisations(offset: Int, limit: Int): [Organisation!]!
        timeFrameById(id: ID!): TimeFrame
        "If offset or limit is not provided, both values are ignored"
        timeFrames(offset: Int, limit: Int): [TimeFrame!]!
        contactInformationById(id: ID!): ContactInformation
        "If offset or limit is not provided, both values are ignored"
        contactInformation(offset: Int, limit: Int): [ContactInformation!]!
        personById(id: ID!): Person
        "If offset or limit is not provided, both values are ignored"
        persons(offset: Int, limit: Int): [Person!]
        "If offset or limit is not provided, both values are ignored"
        bikeEventTypes(offset: Int, limit: Int): [BikeEventType!]
        bikeEventTypeByd(id: ID!): BikeEventType
        "If offset or limit is not provided, both values are ignored"
        bikeEvents(offset: Int, limit: Int): [BikeEvent!]!
        bikeEventById(id:ID!): BikeEvent
        "actionLog for current user"
        actionLog: [ActionLog!]
        "actionLog for specific user"
        actionLogByUser(id: ID!): [ActionLog!]
        "actionLog form all users"
        actionLogAll: [ActionLog!]
    }

    type Mutation {
        """
        CARGO BIKE
        creates new cargoBike and returns cargobike with new ID
        """
        createCargoBike(cargoBike: CargoBikeCreateInput!): CargoBike!
        "lock cargoBike returns bike if bike is not locked and locks bike or Error if bike cannot be locked"
        lockCargoBike(id: ID!): CargoBike!
        "unlock cargoBike, returns true if Bike does not exist"
        unlockCargoBike(id: ID!): CargoBike!
        "updates cargoBike of given ID with supplied fields and returns updated cargoBike"
        updateCargoBike(cargoBike: CargoBikeUpdateInput!): CargoBike!
        "true on success"
        deleteCargoBike(id: ID!): Boolean!
        """
        EQUIPMENT
        creates new peace of unique Equipment
        """
        createEquipment(equipment: EquipmentCreateInput!): Equipment!
        "lock equipment returns true if bike is not locked or if it doesnt exist"
        lockEquipment(id: ID!): Equipment!
        "unlock Equipment, returns true if Bike does not exist"
        unlockEquipment(id: ID!): Equipment!
        "update Equipment, returns updated equipment. CargoBike will be null, if cargoBikeId is not set. Pass null for cargoBikeIs to delete the relation"
        updateEquipment(equipment: EquipmentUpdateInput!): Equipment!
        deleteEquipment(id: ID!): Boolean!
        createEquipmentType(equipmentType: EquipmentTypeCreateInput!): EquipmentType!
        lockEquipmentType(id: ID!): EquipmentType!
        unlockEquipmentType(id: ID!): EquipmentType!
        updateEquipmentType(equipmentType: EquipmentTypeUpdateInput!): EquipmentType!
        deleteEquipmentType(id: ID!): Boolean!
        """
        LENDINGSTATION
        creates new lendingStation and returns lendingStation with new ID
        """
        createLendingStation(lendingStation: LendingStationCreateInput): LendingStation!
        lockLendingStation(id: ID!): LendingStation!
        unlockLendingStation(id: ID!): LendingStation!
        "updates lendingStation of given ID with supplied fields and returns updated lendingStation"
        updateLendingStation(lendingStation: LendingStationUpdateInput!): LendingStation!
        deleteLendingStation(id: ID!): Boolean!
        createTimeFrame(timeFrame: TimeFrameCreateInput!): TimeFrame!
        lockTimeFrame(id: ID!): TimeFrame!
        unlockTimeFrame(id: ID!): TimeFrame!
        updateTimeFrame(timeFrame: TimeFrameUpdateInput!): TimeFrame!
        deleteTimeFrame(id: ID!): Boolean!
        """
        BIKEEVENT
        """
        createBikeEventType(name: String!): BikeEventType!
        lockBikeEventType(id: ID!): BikeEventType!
        unlockBikeEventType(id:ID!): BikeEventType!
        updateBikeEventType(bikeEventType: BikeEventTypeUpdateInput!): BikeEventType!
        deleteBikeEventType(id: ID!): Boolean!
        "creates new BikeEvent"
        createBikeEvent(bikeEvent: BikeEventCreateInput!): BikeEvent!
        lockBikeEvent(id: ID!): BikeEvent!
        unlockBikeEvent(id: ID!): BikeEvent!
        updateBikeEvent(bikeEvent: BikeEventUpdateInput!): BikeEvent
        deleteBikeEvent(id: ID!): Boolean!
        """
        PARTICIPANTS
        """
        createParticipant(participant: ParticipantCreateInput!): Participant!
        lockParticipant(id: ID!): Participant!
        unlockParticipant(id: ID!): Boolean
        updateParticipant(participant: ParticipantUpdateInput!): Participant!
        deleteParticipant(id: ID!): Boolean!
        createWorkshopType(workshopType: WorkshopTypeCreateInput!): WorkshopType!
        lockWorkshopType(id: ID!): WorkshopType!
        unlockWorkshopType(id: ID!): Boolean!
        updateWorkshopType(workshopType: WorkshopTypeUpdateInput!): WorkshopType!
        deleteWorkshopType(id: ID!): Boolean!
        createWorkshop(workshop: WorkshopCreateInput!): Workshop!
        lockWorkshop(id: ID!): Workshop!
        unlockWorkshop(id: ID!): Boolean!
        updateWorkshop(workshop: WorkshopUpdateInput!): Workshop!
        deleteWorkshop(id: ID!): Boolean!
        "create new contactInfo"
        createContactInformation(contactInformation: ContactInformationCreateInput!): ContactInformation!
        lockContactInformation(id: ID!): ContactInformation!
        unlockContactInformation(id: ID!): Boolean!
        updateContactInformation(contactInformation: ContactInformationUpdateInput!): ContactInformation!
        deleteContactInformation(id: ID!): Boolean!
        createPerson(person: PersonCreateInput!): Person!
        lockPerson(id: ID!): Person!
        unlockPerson(id: ID!): Person!
        updatePerson(person: PersonUpdateInput!): Person!
        deletePerson(id: ID!): Boolean!
        "create Engagement"
        createEngagement(engagement: EngagementCreateInput): Engagement!
        lockEngagement(id: ID!): Engagement!
        unlockEngagement(id: ID!): Boolean!
        updateEngagement(engagement: EngagementUpdateInput!): Engagement!
        deleteEngagement(id: ID!): Boolean!
        createEngagementType(engagementType: EngagementTypeCreateInput!): EngagementType!
        lockEngagementType(id: ID!): EngagementType!
        unlockEngagementType(id: ID!): Boolean!
        updateEngagementType(engagementType: EngagementTypeUpdateInput!): EngagementType!
        deleteEngagementType(id: ID!): Boolean!
        createProvider(provider: ProviderCreateInput!): Provider!
        lockProvider(id: ID!): Provider!
        unlockProvider(id: ID!): Boolean!
        updateProvider(provider: ProviderUpdateInput!): Provider!
        deleteProvider(id: ID!): Boolean!
        createOrganisation(organisation: OrganisationCreateInput!): Organisation!
        lockOrganisation(id: ID!): Organisation!
        unlockOrganisation(id: ID!): Boolean!
        updateOrganisation(organisation: OrganisationUpdateInput!): Organisation!
        deleteOrganisation(id: ID!): Boolean!
    }

`;
