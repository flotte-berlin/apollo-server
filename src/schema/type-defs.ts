import { gql } from 'apollo-server-express';

export default gql`

"timestamp object YYYY-MM-ddThh:mm:ss.sssZ"
scalar Date
"only time hh-mm-ss"
scalar Time

"The CargoBike type is central to the graph. You could call it the root."
type CargoBike {
    id: ID!
    "see column A in info tabelle"
    group: Group
    name: String
    modelName: String
    numberOfWheels: Int
    forCargo: Boolean
    forChildren: Boolean
    numberOfChildren: Int!
    """
    Safety is a custom type, that stores information about security features.
    TODO: Should this be called Security?
    """
    security: Security!
    """
    Does not refer to an extra table in the database.
    """
    technicalEquipment: TechnicalEquipment
    """
    Does not refer to an extra table in the database.
    """
    dimensionsAndLoad: DimensionsAndLoad!
    bikeEvents(offset: Int, limit: Int): [BikeEvent]
    equipment(offset: Int!, limit: Int!): [Equipment]
    "Refers to equipment that is not unique. See kommentierte info tabelle -> Fragen -> Frage 2"
    equipmentType: [EquipmentType]
    "Sticker State"
    stickerBikeNameState: StickerBikeNameState
    note: String
    provider: Provider
    coordinator:  Participant
    insuranceData: InsuranceData!
    lendingStation: LendingStation
    taxes: Taxes
    engagement(offset: Int!, limit: Int!): [Engagement]
    timeFrames: [TimeFrame]
    isLocked: Boolean!
    "null if not locked by other user"
    lockedBy: ID
    lockedUntil: Date
}

"""
if you want to add bike to a lending station, create a new timeFrame with to: Date = null
"""
input CargoBikeCreateInput {
    "see column A in info tabelle"
    group: Group!
    name: String!
    modelName: String!
    numberOfWheels: Int!
    forCargo: Boolean!
    forChildren: Boolean!
    numberOfChildren: Int!
    """
    Safety is a custom type, that stores information about security features.
    TODO: Should this be called Security?
    """
    security: SecurityCreateInput!
    """
    Does not refer to an extra table in the database.
    """
    technicalEquipment: TechnicalEquipmentCreateInput!
    """
    Does not refer to an extra table in the database.
    """
    dimensionsAndLoad: DimensionsAndLoadCreateInput!
    "Refers to equipment that is not unique. See kommentierte info tabelle -> Fragen -> Frage 2"
    equipmentTypeIds: [ID]
    "Sticker State"
    stickerBikeNameState: StickerBikeNameState
    note: String
    providerId: ID
    insuranceData: InsuranceDataCreateInput!
    taxes: TaxesCreateInput!
}

"""
if you want to add bike to a lending station, create a new timeFrame with to: Date = null
"""
input CargoBikeUpdateInput {
    id: ID!
    "see column A in info tabelle"
    group: Group
    name: String
    modelName: String
    numberOfWheels: Int
    forCargo: Boolean
    forChildren: Boolean
    numberOfChildren: Int
    """
    Safety is a custom type, that stores information about security features.
    TODO: Should this be called Security?
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
    If set, ols realtions will be over written. Set [] to delete all
    """
    equipmentTypeIds: [ID]
    "Sticker State"
    stickerBikeNameState: StickerBikeNameState
    note: String
    provider: String
    insuranceData: InsuranceDataUpdateInput
    taxes: TaxesUpdateInput
    "will keep Bike locked if set to true, default = false"
    keepLock: Boolean
}

type InsuranceData {
    """
    Eventuelly, this field will become an enum or a separate data table and user can choose from a pool of insurance companies.
    """
    name: String!
    benefactor: String!
    billing: String!
    noPnP: String!
    "eg. Anbieter, flotte, eigenleistung"
    maintenanceResponsible: String!
    maintenanceBenefactor: String!
    maintenanceAgreement: String
    hasFixedRate: Boolean!
    fixedRate: Float
    "Projektzuschuss"
    projectAllowance: Float
    notes: String
}

input InsuranceDataCreateInput {
    """
    Eventually, this field will become an enum or a separate data table and user can choose from a pool of insurance companies.
    """
    name: String!
    benefactor: String!
    billing: String!
    noPnP: String!
    "eg. Anbieter, flotte, eigenleistung"
    maintenanceResponsible: String!
    maintenanceBenefactor: String!
    maintenanceAgreement: String
    hasFixedRate: Boolean!
    fixedRate: Float
    "Projektzuschuss"
    projectAllowance: Float
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
    "Projektzuschuss"
    projectAllowance: Float
    notes: String
}

"How are the dimensions and how much weight can handle a bike. This data is merged in the CargoBike table and the BikeModel table."
type DimensionsAndLoad {
    hasCoverBox: Boolean!
    lockable: Boolean!
    boxLength: Float!
    boxWidth: Float!
    boxHeight: Float!
    maxWeightBox: Float!
    maxWeightLuggageRack: Float!
    maxWeightTotal: Float!
    bikeLength: Float!
    bikeWidth: Float
    bikeHeight: Float
    bikeWeight: Float
}

input DimensionsAndLoadCreateInput {
    hasCoverBox: Boolean!
    lockable: Boolean!
    boxLength: Float!
    boxWidth: Float!
    boxHeight: Float!
    maxWeightBox: Float!
    maxWeightLuggageRack: Float!
    maxWeightTotal: Float!
    bikeLength: Float!
    bikeWidth: Float
    bikeHeight: Float
    bikeWeight: Float
}

input DimensionsAndLoadUpdateInput {
    hasCoverBox: Boolean
    lockable: Boolean
    boxLength: Float
    boxWidth: Float
    boxHeight: Float
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
    bicycleShift: String!
    isEBike: Boolean!
    hasLightSystem: Boolean!
    specialFeatures: String
}

input TechnicalEquipmentCreateInput {
    bicycleShift: String!
    isEBike: Boolean!
    hasLightSystem: Boolean!
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
    frameNumber: String!
    keyNumberFrameLock: String
    keyNumberAXAChain: String
    policeCoding: String
    adfcCoding: String
}

input SecurityCreateInput {
    frameNumber: String!
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
    isLocked: Boolean!
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
    keepLock: Boolean
}

type Workshop {
    id: ID!
    title: String!
    description: String!
    date: Date!
    workshopType: WorkshopType!
    trainer1: Participant!
    trainer2: Participant
    isLocked: Boolean!
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
    from: Date!
    to: Date
    participant: Participant!
    cargoBike: CargoBike!
    isLocked: Boolean!
    "null if not locked by other user"
    lockedBy: ID
    lockedUntil: Date
}

input EngagementCreateInput {
    engagementTypeId: ID!
    "will use CURRENT_DATE if not set"
    from: Date
    "will use infinit if not set"
    to: Date
    participantId: ID!
    cargoBikeId: ID!
}
input EngagementUpdateInput {
    id: ID!
    engagementTypeId: ID
    from: Date
    to: Date
    participantId: ID
    cargoBikeId: ID
    keepLock: Boolean
}

type Taxes {
    costCenter: String!
    organisationArea: OrganisationArea
}

input TaxesCreateInput {
    costCenter: String!
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

type EquipmentType {
    id: ID!
    name: String!
    description: String!
    isLocked: Boolean!
    "null if not locked by other user"
    lockedBy: ID
    lockedUntil: Date
}

input EquipmentTypeCreateInput {
    name: String
    description: String
}
   
input EquipmentTypeUpdateInput {
    id: ID!
    name: String
    description: String
    keepLock: Boolean
}

"An Event is a point in time, when the state of the bike somehow changed."
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
    documents: [String]!    
    remark: String
    isLocked: Boolean!
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
    isLocked: Boolean!
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
    cargoBikes: [CargoBike]
    isLocked: Boolean!
    "null if not locked by other user"
    lockedBy: ID
    lockedUntil: Date
}

"(dt. Anbieter)"
input ProviderCreateInput {
    formName: String!
    privatePersonId: ID
    organisationId: ID
    cargoBikeIds: [ID]
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
    contactInformation: [ContactInformation]
    isLocked: Boolean!
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
    lendingStations: [LendingStation]
    "registration number of association"
    associationNo: String
    "If Club, at what court registered"
    registeredAt: String
    provider: Provider
    contactInformation: ContactInformation
    otherData: String
    isLocked: Boolean!
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
    timeFrames: [TimeFrame]!
    loanPeriod: LoanPeriod
    cargoBikes: [CargoBike]
    "Total amount of cargoBikes currently assigned to the lending station"
    numCargoBikes: Int!
    organisation: Organisation
    isLocked: Boolean!
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
    notes: [String]
    """
    Loan times from and until for each day of the week.
    Starting with Monday from, Monday to, Tuesday from, ..., Sunday to 
    """
    loanTimes: [String]
}

"(dt. Zeitscheibe) When was a bike where"
type TimeFrame {
    id: ID!
    "format YYYY-MM-dd"
    from: Date!
    "format YYYY-MM-dd"
    to: Date
    note: String
    lendingStation: LendingStation!
    cargoBike: CargoBike!
    isLocked: Boolean!
    "null if not locked by other user"
    lockedBy: ID
    lockedUntil: Date
}

input TimeFrameCreateInput {
    from: Date!
    to: Date
    note: String
    lendingStationId: ID!
    cargoBikeId: ID!
}

input TimeFrameUpdateInput {
    id: ID!
    from: Date
    to: Date
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
    entity: String!
    "in json format"
    entriesOld: String!
    "in json format"
    entriesNew: String!
}
    
type Query {
    "Will (eventually) return all properties of cargo bike"
    cargoBikeById(id:ID!): CargoBike
    "returns cargoBikes ordered by name ascending, relations are not loaded, use cargoBikeById instead"
    cargoBikes(offset: Int!, limit: Int!): [CargoBike]!
    engagementById(id: ID!): Engagement
    engagements(offset: Int!, limit: Int!): [Engagement]!
    engagementTypeById(id: ID!): EngagementType
    engagementTypes(offset: Int!, limit: Int!): [EngagementType]!
    "equipment by id, will return null if id not found"
    equipmentById(id: ID!): Equipment
    equipment(offset: Int!, limit: Int!): [Equipment]!
    equipmentTypeById(id: ID!): EquipmentType
    equipmentTypes(offset: Int!, limit: Int!): [EquipmentType]!
    "return null if id not found"
    providerById(id:ID!): Provider
    "unique equipment with pagination, contains relation to bike (with no further joins), so if you wanna know more about the bike, use cargoBikeById"
    providers(offset: Int!, limit: Int!): [Provider]!
    "participant by id"
    participantById(id:ID!):  Participant
    participants(offset: Int!, limit: Int!): [ Participant]!
    workshopTypeById(id: ID!): WorkshopType
    workshopTypes(offset: Int!, limit: Int!): [WorkshopType]!
    workshopById(id: ID!): Workshop
    workshops(offset: Int!, limit: Int!): [Workshop]!
    lendingStationById(id:ID!): LendingStation
    lendingStations(offset: Int!, limit: Int!): [LendingStation]!
    organisationById(id: ID!): Organisation
    organisations(offset: Int!, limit: Int!): [Organisation]!
    timeFrameById(id: ID!): TimeFrame
    timeframes(offset: Int!, limit: Int!): [TimeFrame]!
    contactInformationById(id: ID!): ContactInformation
    contactInformation(offset: Int!, limit: Int!): [ContactInformation]!
    personById(id: ID!): Person
    persons(offset: Int!, limit: Int!): [Person]
    bikeEventTypes(offset: Int!, limit: Int!): [BikeEventType]
    bikeEventTypeByd(id: ID!): BikeEventType
    bikeEvents(offset: Int!, limit: Int!): [BikeEvent]!
    bikeEventById(id:ID!): BikeEvent
    "actionLog for current user"
    actionLog: [ActionLog]
    "actionLog for specific user"
    actionLogByUser(id: ID!): [ActionLog]
    "actionLog form all users"
    actionLogAll: [ActionLog]
}

type Mutation {
    """
    CargoBikes
    creates new cargoBike and returns cargobike with new ID
    """
    createCargoBike(cargoBike: CargoBikeCreateInput!): CargoBike!
    "lock cargoBike returns bike if bike is not locked and locks bike or Error if bike cannot be locked"
    lockCargoBikeById(id: ID!): CargoBike!
    "unlock cargoBike, returns true if Bike does not exist"
    unlockCargoBikeById(id: ID!): Boolean!
    "updates cargoBike of given ID with supplied fields and returns updated cargoBike"
    updateCargoBike(cargoBike: CargoBikeUpdateInput!): CargoBike!
    """
    EQUIPMENT
    creates new peace of unique Equipment
    """
    createEquipment(equipment: EquipmentCreateInput!): Equipment!
    "lock equipment returns true if bike is not locked or if it doesnt exist"
    lockEquipmentById(id: ID!): Equipment!
    "unlock Equipment, returns true if Bike does not exist"
    unlockEquipmentById(id: ID!): Boolean!
    "update Equipment, returns updated equipment. CargoBike will be null, if cargoBikeId is not set. Pass null for cargoBikeIs to delete the relation"
    updateEquipment(equipment: EquipmentUpdateInput!): Equipment!
    createEquipmentType(equipmentType: EquipmentTypeCreateInput!): EquipmentType!
    lockEquipmentType(id: ID!): EquipmentType!
    unlockEquipmentType(id: ID!): Boolean!
    updateEquipmentType(equipmentType: EquipmentTypeUpdateInput!): EquipmentType!
    """
    LENDINGSTATION
    creates new lendingStation and returns lendingStation with new ID
    """
    createLendingStation(lendingStation: LendingStationCreateInput): LendingStation!
    lockLendingStationById(id: ID!): LendingStation
    unlockLendingStationById(id: ID!): Boolean!
    "updates lendingStation of given ID with supplied fields and returns updated lendingStation"
    updateLendingStation(lendingStation: LendingStationUpdateInput!): LendingStation!
    createTimeFrame(timeFrame: TimeFrameCreateInput!): TimeFrame!
    lockTimeFrame(id: ID!): TimeFrame!
    unlockTimeFrame(id: ID!): Boolean!
    updateTimeFrame(timeFrame: TimeFrameUpdateInput!): TimeFrame!
    """
    BIKEEVENT
    """
    createBikeEventType(name: String!): BikeEventType!
    lockBikeEventType(id: ID!): BikeEventType!
    unlockBikeEventType(id:ID!): Boolean!
    updateBikeEventType(bikeEventType: BikeEventTypeUpdateInput!): BikeEventType!
    "creates new BikeEvent"
    createBikeEvent(bikeEvent: BikeEventCreateInput!): BikeEvent!
    lockBikeEventById(id: ID!): BikeEvent
    unlockBikeEventById(id: ID!): Boolean!
    updateBikeEvent(bikeEvent: BikeEventUpdateInput!): BikeEvent
    """
    PARTICIPANTS
    """
    createParticipant(participant: ParticipantCreateInput!): Participant!
    lockParticipant(id: ID!): Participant!
    unlockParticipant(id: ID!): Boolean
    updateParticipant(participant: ParticipantUpdateInput!): Participant!
    createWorkshopType(workshopType: WorkshopTypeCreateInput!): WorkshopType!
    lockWorkshopType(id: ID!): WorkshopType!
    unlockWorkshopType(id: ID!): Boolean!
    updateWorkshopType(workshopType: WorkshopTypeUpdateInput!): WorkshopType!
    createWorkshop(workshop: WorkshopCreateInput!): Workshop!
    lockWorkshop(id: ID!): Workshop!
    unlockWorkshop(id: ID!): Boolean!
    updateWorkshop(workshop: WorkshopUpdateInput!): Workshop!
    "create new contactInfo"
    createContactInformation(contactInformation: ContactInformationCreateInput!): ContactInformation!
    lockContactInformation(id: ID!): ContactInformation!
    unlockContactInformation(id: ID!): Boolean!
    updateContactInformation(contactInformation: ContactInformationUpdateInput!): ContactInformation!
    createPerson(person: PersonCreateInput!): Person!
    lockPerson(id: ID!): Person!
    unlockPerson(id: ID!): Person!
    updatePerson(person: PersonUpdateInput!): Person!
    lockEngagement(id: ID!): Engagement!
    unlockEngagement(id: ID!): Boolean!
    updateEngagement(engagement: EngagementUpdateInput!): Engagement!
    createEngagementType(engagementType: EngagementTypeCreateInput!): EngagementType!
    lockEngagementType(id: ID!): EngagementType!
    unlockEngagementType(id: ID!): Boolean!
    updateEngagementType(engagementType: EngagementTypeUpdateInput!): EngagementType!
    "create Engagement"
    createEngagement(engagement: EngagementCreateInput): Engagement!
    createProvider(provider: ProviderCreateInput!): Provider!
    lockProvider(id: ID!): Provider!
    unlockProvider(id: ID!): Boolean!
    updateProvider(provider: ProviderUpdateInput!): Provider!
    createOrganisation(organisation: OrganisationCreateInput!): Organisation!
    lockOrganisation(id: ID!): Organisation!
    unlockOrganisation(id: ID!): Boolean!
    updateOrganisation(organisation: OrganisationUpdateInput!): Organisation!
}

`;
