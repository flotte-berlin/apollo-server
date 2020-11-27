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

/* eslint no-unused-vars: "off" */
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
    DeleteDateColumn
} from 'typeorm';
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
    OK = 'OK',
    IMPROVE = 'IMPROVE',
    PRODUCED = 'PRODUCED',
    NONEED = 'NONEED',
    MISSING = 'MISSING',
    UNKNOWN = 'UNKNOWN'
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
    @Column({
        nullable: true
    })
    bicycleShift: string;

    @Column({
        nullable: true
    })
    isEBike: boolean;

    @Column({
        nullable: true
    })
    hasLightSystem: boolean;

    @Column({
        nullable: true
    })
    specialFeatures: string;
}

export class DimensionsAndLoad {
    @Column({
        nullable: true
    })
    hasCoverBox: boolean;

    @Column({
        nullable: true
    })
    lockable:boolean;

    @Column({
        type: 'numrange',
        nullable: true
    })
    boxLengthRange: string;

    @Column({
        type: 'numrange',
        nullable: true
    })
    boxWidthRange: string;

    @Column({
        type: 'numrange',
        nullable: true
    })
    boxHeightRange: string;

    @Column({
        type: 'decimal',
        nullable: true
    })
    maxWeightBox: string;

    @Column({
        type: 'decimal',
        nullable: true
    })
    maxWeightLuggageRack: number;

    @Column({
        type: 'decimal',
        nullable: true
    })
    maxWeightTotal: number;

    @Column({
        type: 'decimal',
        nullable: true
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

    @DeleteDateColumn()
    deleteDate: Date;

    @Column({
        type: 'enum',
        enum: Group
    })
    group: Group;

    @Column({
        unique: true
    })
    name: string;

    @OneToMany(type => Equipment, equipment => equipment.cargoBikeId, {
        nullable: true,
        eager: true
    })
    equipmentIds: number[];

    // Equipment that is not unique and is supposed to be selected out of a list e.g. drop down
    @ManyToMany(type => EquipmentType, equipmentType => equipmentType.cargoBikeIds)
    @JoinTable()
    equipmentTypeIds: number[];

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

    @ManyToOne(type => Provider, provider => provider.cargoBikeIds, {
        nullable: true
    })
    @JoinColumn({ name: 'providerId' })
    providerId: number;

    @OneToMany(type => BikeEvent, bikeEvent => bikeEvent.cargoBikeId, {
        nullable: true,
        cascade: true
    })
    @JoinColumn()
    bikeEvents: BikeEvent[];

    @Column(type => InsuranceData)
    insuranceData: InsuranceData;

    @OneToMany(type => TimeFrame, timeFrame => timeFrame.cargoBikeId, {
        nullable: true
    })
    timeFrames: TimeFrame[];

    @OneToMany(type => Engagement, engagement => engagement.cargoBikeId)
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
