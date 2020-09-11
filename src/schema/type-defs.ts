import { gql } from 'apollo-server'

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
    numberOfChildren: Int
    serialno: String
    """
    Safety is a custom type, that stores information about security features.
    TODO: Should this be calles Security?
    """
    security: Security
    """
    Does not refere to an extra table in the database.
    """
    technicalEquipment: TechnicalEquipment
    """
    Does not refere to an extra table in the database.
    """
    dimensionsAndLoad: DimensionsAndLoad
    events: [BikeEvent]
    equipment: [Equipment]
    "Refers to equipment that is not unique. See kommentierte info tabelle -> Fragen -> Frage 2"
    otherEquipment: String
    chainSwaps: [ChainSwap]
    "Sticker State"
    stickerBikeNameState: StickerBikeNameState
    note: String
    provider: Provider
    coordinator: Coordinator
    insuranceData: InsuranceData
    loantimes: [LoanTimes]
}

type InsuranceData {
    """
    Eventuelly, this field will become an enum or a seperate data table and user can choose from a pool of insurance companies.
    """
    name: String

}
type Coordinator {
    id:ID!
    contactInformation: ContactInformation!
    note: String
    corgoBikes: [CargoBike]!
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
    name: String
    dimensionsAndLoad: DimensionsAndLoad!
    technicalEquipment: TechnicalEquipment!
}

type ActiveMentor {
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
    roleAmbulanz: Boolean!
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
    TODO unclear what this means
    """
    investable: Boolean
    name: String
}

"An Event is a point in time, when the state of the bike somehow changed."
type BikeEvent {
    id: ID!
    type: BikeEventType
    """
    TODO: An Event should have a date field (Leon).
    """
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

"How are the dimensions and how much weight can handle a bike."
type DimensionsAndLoad {
    id: ID!
    hasCoverBox: Boolean
    lockable: Boolean
    boxLenght: Float
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
    bicycleShift: String
    isEBike: Boolean
    hasLightingSystem: Boolean
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
    "If Club, at what court registered"
    registeredAt: String
    registerNumber: String
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

type Organisation{
    id: ID!
    "(dt. Ausleihstation)"
    lendinglocation: [LendingStation]
    "registration number of association"
    associationNo: String
    otherdata: String
}

"(dt. Standort)"
type LendingStation {
    id: ID!
    contactInformation: [ContactInformation]!
    address: Address
    loanTimes: LoanTimes
    loanPeriods: [LoanPeriod]!
}

"(dt. Ausleihzeiten)"
type LoanTimes {
    notes: String
}

"(dt. Zeitscheibe)"
type LoanPeriod{
    id: ID!
    from: Date!
    to: Date
    note: String
    lendingstation: LendingStation!
    cargobike: CargoBike!
}

type Address {
    street: String
    number: String
    zip: String
}

type Query {
    CargobikeById(token:String!,id:ID!): CargoBike
    Cargobikes(token:String!): [CargoBike]!
    CargobikesByProvider(token:String!,providerId:ID!): [CargoBike]!
    ProviderById(token:String!,id:ID!): Provider
    Providers(token:String!): [Provider]!
    ActiveMentorById(token:String!,id:ID!): ActiveMentor
    ActiveMentors(token:String!): [ActiveMentor]!
    lendingStationById(token:String!, id:ID!): LendingStation
    lendingStations(token:String!): [LendingStation]!
    contactInformation(token:String!): [ContactInformation]!
}

type UpdateBikeResponse {
    success: Boolean
    message: String
    bike: CargoBike
}

input CargoBikeInput {
    "if null, then new bike will be created, else old bike will be updated"
    id: ID
    "see column A in info tabelle"
    group: Group
    name: String
    modelName: String
    numberOfWheels: Int
    forCargo: Boolean
    forChildren: Boolean
    numberOfChildren: Int
    serialno: String
    """
    Safety is a custom type, that stores information about security features.
    TODO: Should this be calles Security?
    """
    security: String
    """
    Does not refere to an extra table in the database.
    """
    technicalEquipment: String
    """
    Does not refere to an extra table in the database.
    """
    dimensionsAndLoad: String
    "Refers to equipment that is not unique. See kommentierte info tabelle -> Fragen -> Frage 2"
    otherEquipment: String
    "Sticker State"
    stickerBikeNameState: String
    note: String
    provider: String
    coordinator: String
    insuranceData: String
}
type Mutation {
    "for testing"
    addBike(id: ID!, token: String!, name: String): UpdateBikeResponse!
    "if id: null, then new bike will be created, else old bike will be updated"
    cargoBike(token:String!,cargoBike: CargoBikeInput): UpdateBikeResponse!
}

`
