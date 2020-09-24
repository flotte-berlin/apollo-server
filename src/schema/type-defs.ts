import { gql } from 'apollo-server';

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
    TODO: Should this be calles Security?
    """
    security: Security!
    """
    Does not refere to an extra table in the database.
    """
    technicalEquipment: TechnicalEquipment
    """
    Does not refere to an extra table in the database.
    """
    dimensionsAndLoad: DimensionsAndLoad!
    bikeEvents: [BikeEvent]
    equipment(offset: Int!, limit: Int!): [Equipment]
    "Refers to equipment that is not unique. See kommentierte info tabelle -> Fragen -> Frage 2"
    miscellaneousEquipment: [String]
    "Sticker State"
    stickerBikeNameState: StickerBikeNameState
    note: String
    provider: Provider
    coordinator:  Participant
    insuranceData: InsuranceData!
    lendingStation: LendingStation
    taxes: Taxes
    engagement(offset: Int!, limit: Int!): [Engagement]
    isLocked: Boolean!
    "null if not locked by other user"
    lockedBy: ID
    lockedUntil: Date
}

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
    TODO: Should this be calles Security?
    """
    security: SecurityCreateInput!
    """
    Does not refere to an extra table in the database.
    """
    technicalEquipment: TechnicalEquipmentCreateInput!
    """
    Does not refere to an extra table in the database.
    """
    dimensionsAndLoad: DimensionsAndLoadCreateInput!
    "Refers to equipment that is not unique. See kommentierte info tabelle -> Fragen -> Frage 2"
    miscellaneousEquipment: [String]

    "Sticker State"
    stickerBikeNameState: StickerBikeNameState
    note: String
    providerId: ID
    insuranceData: InsuranceDataCreateInput!
    lendingStationId: ID
    taxes: TaxesCreateInput!
}

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
    TODO: Should this be calles Security?
    """
    security: SecurityUpdateInput
    """
    Does not refere to an extra table in the database.
    """
    technicalEquipment: TechnicalEquipmentUpdateInput
    """
    Does not refere to an extra table in the database.
    """
    dimensionsAndLoad: DimensionsAndLoadUpdateInput
    "Refers to equipment that is not unique. See kommentierte info tabelle -> Fragen -> Frage 2"
    miscellaneousEquipment: [String]
    "Sticker State"
    stickerBikeNameState: StickerBikeNameState
    note: String
    provider: String
    insuranceData: InsuranceDataUpdateInput
    lendingStationId: ID
    taxes: TaxesUpdateInput
    "will keep Bike locked if set to true, default = false"
    keepLock: Boolean
}

type InsuranceData {
    """
    Eventuelly, this field will become an enum or a seperate data table and user can choose from a pool of insurance companies.
    """
    name: String!
    benefactor: String!
    billing: String!
    noPnP: String!
    "eg. Anbieter, flotte, eigenleistung"
    maintananceResponsible: String!
    maintananceBenefactor: String!
    maintananceAgreement: String
    hasFixedRate: Boolean!
    fixedRate: Float
    "Projektzuschuss"
    projectAllowance: Float
    notes: String
}

input InsuranceDataCreateInput {
    """
    Eventuelly, this field will become an enum or a seperate data table and user can choose from a pool of insurance companies.
    """
    name: String!
    benefactor: String!
    billing: String!
    noPnP: String!
    "eg. Anbieter, flotte, eigenleistung"
    maintananceResponsible: String!
    maintananceBenefactor: String!
    maintananceAgreement: String
    hasFixedRate: Boolean!
    fixedRate: Float
    "Projektzuschuss"
    projectAllowance: Float
    notes: String
}

input InsuranceDataUpdateInput {
    """
    Eventuelly, this field will become an enum or a seperate data table and user can choose from a pool of insurance companies.
    """
    name: String
    benefactor: String
    billing: String
    noPnP: String
    "eg. Anbieter, flotte, eigenleistung"
    maintananceResponsible: String
    maintananceBenefactor: String
    maintananceAgreement: String
    hasFixedRate: Boolean
    fixedRate: Float
    "Projektzuschuss"
    projectAllowance: Float
    notes: String
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
The BikeModel can be used for instantiate new bikes with a given model.
It should only be used to fill in default values.
Even bikes of the same model can have different properties.
"""
type BikeModel {
    id: ID!
    name: String!
    dimensionsAndLoad: DimensionsAndLoad!
    technicalEquipment: TechnicalEquipment!
}

type Participant {
    id: ID!
    start: Date!
    end: Date
    contactInformation: ContactInformation!
    usernamefLotte: String
    usernameSlack: String
    memberADFC: Boolean!
    locationZIPs: [String]
    memberCoreTeam: Boolean!
    roleCoordinator: Boolean!
    roleEmployeADFC: Boolean!
    """
    Wahr, wenn die Person Pate ist.
    """
    roleMentor: Boolean!
    roleAmbulance: Boolean!
    roleBringer: Boolean!
    "Date of workshop to become Mentor dt. Pate"
    workshopMentor: Date
    "Date of last Erste Hilfe Kurs?"
    workshopAmbulance: Date
    """
    Note the kommentierte Infodaten Tabelle.
    This value is calculated form other values.
    It is true, if the person is not on the black list and not retired
    and is either Mentor dt. Pate or Partner Mentor dt. Partnerpate for at least one bike.
    """
    distributedActiveBikeParte: Boolean!
    reserve: String
    engagement: [Engagement]
}

input ParticipantCreateInput {
    start: Date!
    end: Date
    "must create contactinformation first, if you want to use new"
    contactInformationId: ID!
    usernamefLotte: String
    usernameSlack: String
    memberADFC: Boolean!
    locationZIPs: [String]
    memberCoreTeam: Boolean!
    
    "Date of workshop to become Mentor dt. Pate"
    workshopMentor: Date
    "Date of last Erste Hilfe Kurs?"
    workshopAmbulance: Date

    reserve: String
}


type Engagement {
    id: ID!
    from: Date!
    to: Date
    participant: Participant
    cargoBike: CargoBike
    roleCoordinator: Boolean!
    roleEmployeADFC: Boolean!
    """
    Wahr, wenn die Person Pate ist.
    """
    roleMentor: Boolean!
    roleAmbulance: Boolean!
    roleBringer: Boolean!
}

input EngagementCreateInput {
    from: Date!
    to: Date
    participantId: ID!
    cargoBikeId: ID!
    roleCoordinator: Boolean!
    roleEmployeADFC: Boolean!
    """
    Wahr, wenn die Person Pate ist.
    """
    roleMentor: Boolean!
    roleAmbulance: Boolean!
    roleBringer: Boolean!
}

type Taxes {
    costCenter: String!
    organizationArea: OrganizationArea
}

input TaxesCreateInput {
    costCenter: String!
    organizationArea: OrganizationArea
}

input TaxesUpdateInput {
    costCenter: String
    organizationArea: OrganizationArea
}

enum OrganizationArea {
    IB
    ZB
}

type ChainSwap {
    id: ID!
    """
    TODO why is this a string"
    """
    mechanic: String
    timeOfSwap: Date
    keyNumberOldAXAChain: String
}

"""
This type represents a piece of equipment that represents a real physical object.
The object must be unique. So it is possible to tell it apart from similar objects by a serial number.
"""
type Equipment {
    id: ID!
    serialNo: String!
    """
    TODO unclear what this means. tomy fragen
    """
    investable: Boolean
    title: String!
    description: String
    cargoBike: CargoBike
}

input EquipmentCreateInput {
    serialNo: String!
    """
    TODO unclear what this means. tomy fragen
    """
    title: String!
    description: String
    investable: Boolean
    cargoBikeId: ID
}

input EquipmentUpdateInput {
    id: ID!
    serialNo: String
    """
    TODO unclear what this means. tomy fragen
    """
    title: String
    description: String
    investable: Boolean
    cargoBikeId: ID
    "will keep Bike locked if set to true, default = false"
    keepLock: Boolean
}

"An Event is a point in time, when the state of the bike somehow changed."
type BikeEvent {
    id: ID!
    eventType: BikeEventType!
    cargoBike: CargoBike!
    date: Date!
    note: String
    """
    Path to documents
    """
    documents: [String]!
}

input BikeEventCreateInput {
    eventType: BikeEventType!
    "it is enough to pass the cargoBike id"
    cargoBikeId: ID!
    date: Date!
    note: String
    """
    Path to documents
    """
    documents: [String]!
}

"TODO: Some eventTypes are missing"
enum BikeEventType {
    """
    The enum EventType can also be represented as an enum in postgresQL.
    It is possible to add items to an enum in postgresQL without changing the source code.
    However, it not possible to change the graphQL schema.
    Concluding we should not use an enum here, if users want to add EventTypes to the enum.
    """
    KAUF
    INBETRIEBNAHME
    AUSFALL
    WARTUNG
    ANDERE
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

"(dt. Anbieter) bezieht sich auf die Benziehung einer Person oder Organisation zum Lastenrad"
type Provider {
    id: ID!
    formularName: String
    contactPersons: [ContactInformation]!
    isPrivatePerson: Boolean!
    organisation: Organisation
    cargoBikes: [CargoBike]!
}

"(dt. Anbieter)"
input ProviderCreateInput {
    formularName: String!
    "i think it makes more sense to create Provider and then add new ContactPersons"
    contactPersonIds: [ID]!
    isPrivatePerson: Boolean!
    organisationId: ID
    cargoBikeIds: [ID]!
}

type ContactInformation {
    id: ID!
    name: String!
    firstName: String
    retiredAt: Date
    phoneExtern: String
    phone2Extern: String
    phoneIntern: String
    phone2Intern: String
    emailExtern: String
    emailIntern: String
    note: String
}

input ContactInformationCreateInput {
    name: String!
    firstName: String!
    retiredAt: Date
    phoneExtern: String
    phone2Extern: String
    phoneIntern: String
    phone2Intern: String
    emailExtern: String
    emailIntern: String
    note: String
}

input ContactInformationUpdateInput {
    id: ID!
    name: String
    firstName: String
    retiredAt: Date
    phoneExtern: String
    phone2Extern: String
    phoneIntern: String
    phone2Intern: String
    emailExtern: String
    emailIntern: String
    note: String
}

"describes Relation of Contact to Provider"
type ContactPerson {
    id: ID!
    intern: Boolean!
    contactInformation: ContactInformation!
}

input ContactPersonCreateInput {
    intern: Boolean!
    contactInformationId: ID!
}

input ContactPersonUpdateInput {
    id: ID!
    intern: Boolean
    contactInformationId: ID
}

type Organisation {
    id: ID!
    address: Address
    "(dt. Ausleihstation)"
    lendingStations: [LendingStation]
    "registration number of association"
    associationNo: String
    "If Club, at what court registered"
    registeredAt: String
    provider: Provider
    otherdata: String
}

"(dt. Standort)"
type LendingStation {
    id: ID!
    name: String!
    contactPersons: [ContactPerson]!
    address: Address!
    timeFrames: [TimeFrame]!
    loanPeriods: LoanPeriods
    cargoBikes: [CargoBike]
    "Totola Amount of cargoBikes currently assigned to the lending station"
    numCargoBikes: Int!
}

input LendingStationCreateInput {
    name: String!
    contactPersonIds: [ID]!
    address: AddressCreateInput!
    loanPeriods: LoanPeriodsInput
    timeFrameIds: [ID]!
}

input LendingStationUpdateInput {
    id: ID!
    name: String
    contactInformation: [ContactInformationUpdateInput]
    address: AddressUpdateInput
    loanPeriods: LoanPeriodsInput
    timeFrames: [TimeFrameUpdateInput]
    
}

"""
(dt. Ausleihzeiten) not implemented
"""
type LoanPeriods {
    generalRemark: String
    "notes for each day of the week, starting on Monday"
    notes: [String]
    """
    Loan times from and until for each day of the week.
    Starting with Monday from, Monday to, Tuesday from, ..., Sunday to 
    """
    times: [String]
}

"""
(dt. Ausleihzeiten)
"""
input LoanPeriodsInput {
    generalRemark: String
    "notes for each day of the week, starting on Monday"
    notes: [String]
    """
    Loan times from and until for each day of the week.
    Starting with Monday from, Monday to, Tuesday from, ..., Sunday to 
    """
    times: [String]
}

"(dt. Zeitscheibe) When was a bike where"
type TimeFrame {
    id: ID!
    from: Date!
    to: Date
    note: String
    lendingStation: LendingStation!
    cargoBike: CargoBike!
}

input TimeFrameCreateInput {
    from: Date!
    to: Date
    note: String
    lendingStationID: ID!
    cargoBikeID: ID!
}

input TimeFrameUpdateInput {
    id: ID!
    from: Date
    to: Date
    note: String
    lendingStation: ID
    cargoBike: ID
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

type Query {
    "Will (evetually) return all properties of cargo bike"
    cargoBikeById(id:ID!): CargoBike
    "returns cargoBikes ordered by name ascending, relations are not loaded, use cargoBikeById instead"
    cargoBikes(offset: Int!, limit: Int!): [CargoBike]!
    "return null if id not found"
    providerById(id:ID!): Provider
    "unique equipment with pagination, contains relation to bike (with no further joins), so if you wanna know more about the bike, use cargoBikeById"
    equipment(offset: Int!, limit: Int!): [Equipment]!
    "equipment by id, will return null if id not found"
    equipmentById(id: ID!): Equipment
    providers(offset: Int!, limit: Int!): [Provider]!
    "particcipant by id"
    participantById(id:ID!):  Participant
    "p"
    participants(offset: Int!, limit: Int!): [ Participant]!
    lendingStationById(id:ID!): LendingStation
    lendingStations(offset: Int!, limit: Int!): [LendingStation]!
    timeframes(offset: Int!, limit: Int!): [TimeFrame]!
    contactInformation(offset: Int!, limit: Int!): [ContactInformation]!
    "returns BikeEvent with CargoBike"
    bikeEventById(id:ID!): BikeEvent!
}

type Mutation {
    "creates new cargoBike and returns cargobike with new ID"
    createCargoBike(cargoBike: CargoBikeCreateInput!): CargoBike!
    "lock cargoBike returns bike if bike is not locked and locks bike or Error if bike cannot be locked"
    lockCargoBikeById(id: ID!): CargoBike!
    "unlock cargoBike, returns true if Bike does not exist"
    unlockCargoBikeById(id: ID!): Boolean!
    "updates cargoBike of given ID with supplied fields and returns updated cargoBike"
    updateCargoBike(cargoBike: CargoBikeUpdateInput!): CargoBike!
    "creates new peace of unique Equipment"
    createEquipment(equipment: EquipmentCreateInput!): Equipment!
    "lock equipment returns true if bike is not locked or if it doesnt exist"
    lockEquipmentById(id: ID!): Equipment!
    "unlock Equopment, returns true if Bike does not exist"
    unlockEquipment(id: ID!): Boolean!
    "update Equipment, returns updated equipment. CargoBike will be null, if cargoBikeId is not set. Pass null for cargoBikeIs to delete the relation"
    updateEquipment(equipment: EquipmentUpdateInput!): Equipment!
    "creates new lendingStation and returns lendingStation with new ID"
    createLendingStation(lendingStation: LendingStationCreateInput): LendingStation!
    "updates lendingStation of given ID with supplied fields and returns updated lendingStation"
    updateLendingStation(lendingstation: LendingStationUpdateInput!): LendingStation!
    createTimeFrame(timeFrame: TimeFrameCreateInput!): TimeFrame!
    "creates new BikeEvent"
    createBikeEvent(bikeEvent: BikeEventCreateInput): BikeEvent!
    "create participant"
    createParticipant(participant: ParticipantCreateInput!): Participant!
    "create new contactInfo"
    createContactInformation(contactInformation: ContactInformationCreateInput!): ContactInformation!
    "create Engagement"
    createEngagement(engagement: EngagementCreateInput): Engagement!
    "createContacPerson ,return null if contactInformationId does not exist"
    createContactPerson(contactPerson: ContactPersonCreateInput): ContactPerson
    updateContactPerson(contactPerson: ContactPersonUpdateInput): ContactPerson
    "create Provider, if cargoBikeIds or contactPersonIds are not valid, provider will still be created"
    createProvider(provider: ProviderCreateInput!): Provider!
    
}

`;
