/* eslint no-unused-vars: "off" */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { Provider } from './Provider';
import { Participant } from './Participant';
import { InsuranceData } from './InsuranceData';
import { TimeFrame } from './TimeFrame';
import { Taxes } from './Taxes';
import { Equipment } from './Equipment';
import { Engagement } from './Engagement';
import { BikeEvent } from './BikeEvent';
import { EquipmentType } from './EquipmentType';

export enum Group {
    KL = 'KL',
    LI = 'LI',
    SP = 'SP',
    FK = 'FK',
    MH = 'MH',
    SZ = 'SZ',
    TS = 'TS',
    TK = 'TK'
}

export enum StickerBikeNameState {
    OK,
    IMPROVE,
    PRODUCED,
    NONEED,
    MISSING,
    UNKNOWN
}

export interface Lockable {
    id: number,
    lockedBy: number,
    lockedUntil: Date
}

export class Security {
    @Column()
    frameNumber: string;

    @Column({
        nullable: true
    })
    keyNumberFrameLock: string;

    @Column({
        nullable: true
    })
    keyNumberAXAChain: string;

    @Column({
        nullable: true
    })
    policeCoding: string;

    @Column({
        nullable: true
    })
    adfcCoding: string;
}
export class TechnicalEquipment {
    @Column()
    bicycleShift: string;

    @Column()
    isEBike: boolean;

    @Column()
    hasLightSystem: boolean;

    @Column({
        nullable: true
    })
    specialFeatures: string;
}

export class DimensionsAndLoad {
    @Column()
    hasCoverBox: boolean;

    @Column()
    lockable:boolean;

    @Column({
        type: 'decimal'
    })
    boxLength: number;

    @Column({
        type: 'decimal'
    })
    boxWidth: number;

    @Column({
        type: 'decimal'
    })
    boxHeight: number;

    @Column({
        type: 'decimal'
    })
    maxWeightBox: number;

    @Column({
        type: 'decimal'
    })
    maxWeightLuggageRack: number;

    @Column({
        type: 'decimal'
    })
    maxWeightTotal: number;

    @Column({
        type: 'decimal'
    })
    bikeLength: number;

    @Column({
        nullable: true,
        type: 'decimal'

    })
    bikeWidth: number;

    @Column({
        nullable: true,
        type: 'decimal'

    })
    bikeHeight: number;

    @Column({
        nullable: true,
        type: 'decimal'

    })
    bikeWeight: number;
}

@Entity()
export class CargoBike implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: Group
    })
    group: Group;

    @Column()
    name: string;

    @OneToMany(type => Equipment, equipment => equipment.cargoBike, {
        nullable: true,
        eager: true
    })
    equipment: Equipment[];

    // Equipment that is not unique and is supposed to be selected out of a list e.g. drop down
    @ManyToMany(type => EquipmentType, equipmentType => equipmentType.cargoBikes)
    miscellaneousEquipment: EquipmentType[];

    // Security information
    @Column(type => Security)
    security: Security;

    @Column({
        type: 'enum',
        enum: StickerBikeNameState,
        nullable: true
    })
    stickerBikeNameState: StickerBikeNameState;

    @Column({
        nullable: true
    })
    note: string;

    @ManyToOne(type => Provider, {
        nullable: true
    })
    provider: Provider;

    @ManyToOne(type => Participant, participant => participant.cargoBikes, {
        nullable: true
    })
    coordinator: Participant;

    @OneToMany(type => BikeEvent, bikeEvent => bikeEvent.cargoBike, {
        nullable: true,
        cascade: true
    })
    @JoinColumn()
    bikeEvents: BikeEvent[];

    @Column(type => InsuranceData)
    insuranceData: InsuranceData;

    @OneToMany(type => TimeFrame, loanPeriod => loanPeriod.cargoBike, {
        nullable: true
    })
    timeFrames: TimeFrame[];

    @OneToMany(type => Engagement, engagement => engagement.cargoBike)
    engagement: Engagement[];

    @Column(type => Taxes)
    taxes: Taxes;

    @Column({
        nullable: true
    })
    description: string;

    @Column()
    modelName: string;

    @Column()
    numberOfWheels: number;

    @Column()
    forCargo: boolean;

    @Column()
    forChildren: boolean;

    @Column()
    numberOfChildren: number;

    @Column(type => TechnicalEquipment)
    technicalEquipment: TechnicalEquipment;

    @Column(type => DimensionsAndLoad)
    dimensionsAndLoad: DimensionsAndLoad;

    @Column({
        nullable: true
    })
    lockedBy: number;

    @Column({
        type: 'timestamp',
        nullable: true
    })
    lockedUntil: Date;
}
