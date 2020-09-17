import { gql } from 'apollo-server';

export default gql`

scalar Date

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
    events: [BikeEvent]
    equipment: [Equipment]
    "Refers to equipment that is not unique. See kommentierte info tabelle -> Fragen -> Frage 2"
    otherEquipment: [String]
    chainSwaps: [ChainSwap]
    "Sticker State"
    stickerBikeNameState: StickerBikeNameState
    note: String
    provider: Provider
    coordinator:  Participant
    insuranceData: InsuranceData!
    lendingstation: LendingStation
    taxes: Taxes
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
    otherEquipment: [String]

    "Sticker State"
    stickerBikeNameState: StickerBikeNameState
    note: String
    provider: String
    insuranceData: InsuranceDataCreateInput!
    taxes: TaxesCreateInput
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
    otherEquipment: [String]

    "Sticker State"
    stickerBikeNameState: StickerBikeNameState
    note: String
    provider: String
    insuranceData: InsuranceDataUpdateInput
    taxes: TaxesUpdateInput
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
    hasFixedRate: Boolean!
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

type  Participant {
    id: ID!
    start: Date!
    end: Date!
    mentor: ContactInformation!
    usernamefLotte: String
    usernameSlack: String
    memberADFC: Boolean!
    locationZIPs: [String]
    roleCoreTeam: Boolean!
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
    name: String
}

"An Event is a point in time, when the state of the bike somehow changed."
type BikeEvent {
    id: ID!
    eventType: BikeEventType
    date: Date!
    note: String
    """
    Path to documents
    """
    documents: [String]
}

"TODO: Some eventTypes are missing (und auf deutsch)"
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

"(dt. Anbieter)"
type Provider {
    id: ID!
    name: String!
    formularName: String
    address: Address
    
    providerContactPerson: [ContactInformation]
    isPrivatePerson: Boolean!
    organisation: Organisation
    cargoBikes: [CargoBike]!
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

type Organisation {
    id: ID!
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
    contactInformation: [ContactInformation]!
    address: Address!
    loanTimes: LoanTimes
    loanPeriods: [LoanPeriod]!
}

input LendingStationCreateInput {
    name: String!
    contactInformation: [ContactInformationCreateInput]!
    address: AddressCreateInput!
    loanTimes: LoanTimesInput
    loanPeriods: [LoanPeriodCreateInput]!
}

input LendingStationUpdateInput {
    id: ID!
    name: String
    contactInformation: [ContactInformationUpdateInput]
    address: AddressUpdateInput
    loanTimes: LoanTimesInput
    loanPeriods: [LoanPeriodUpdateInput]
}

"""
(dt. Ausleihzeiten)
"""
type LoanTimes {
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
input LoanTimesInput {
    generalRemark: String
    "notes for each day of the week, starting on Monday"
    notes: [String]
    """
    Loan times from and until for each day of the week.
    Starting with Monday from, Monday to, Tuesday from, ..., Sunday to 
    """
    times: [String]
}


"(dt. Zeitscheibe)"
type LoanPeriod {
    id: ID!
    from: Date!
    to: Date
    note: String
    lendingStation: LendingStation!
    cargoBike: CargoBike!
}

input LoanPeriodCreateInput {
    from: Date
    to: Date
    note: String
    lendingStationID: LendingStationCreateInput
    cargoBikeID: CargoBikeCreateInput
}

input LoanPeriodUpdateInput {
    id: ID!
    from: Date
    to: Date
    note: String
    lendingStation: LendingStationUpdateInput
    cargoBike: CargoBikeUpdateInput
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
    cargoBikeById(id:ID!): CargoBike
    "!!!!"
    cargoBikes: [CargoBike]!
    cargoBikesByProvider(providerId:ID!): [CargoBike]!
    providerById(id:ID!): Provider
    providers: [Provider]!
    participantById(id:ID!):  Participant
    participants: [ Participant]!
    lendingStationById(id:ID!): LendingStation
    lendingStations: [LendingStation]!
    contactInformation: [ContactInformation]!
}

type Mutation {
    "for testing"
    addBike(id: ID!, name: String): CargoBike!
    "creates new cargoBike and returns cargobike with new ID"
    createCargoBike(cargoBike: CargoBikeCreateInput!): CargoBike!
    "updates cargoBike of given ID with supplied fields and returns updated cargoBike"
    updateCargoBike(cargoBike: CargoBikeUpdateInput!): CargoBike!
    "creates new lendingStation and returns lendingStation with new ID"
    createLendingStation(lendingStation: LendingStationCreateInput): LendingStation!
    "updates lendingStation of given ID with supplied fields and returns updated lendingStation"
    updateLendingStation(lendingstation: LendingStationUpdateInput!): LendingStation!
}

`;
