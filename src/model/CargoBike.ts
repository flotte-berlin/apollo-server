/* eslint no-unused-vars: "off" */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Bike } from './BikeFeatures';
import { Provider } from './Provider';
import { Participant } from './Participant';
import { InsuranceData } from './InsuranceData';
import { TimeFrame } from './TimeFrame';
import { LendingStation } from './LendingStation';
import { Taxes } from './Taxes';
import { Equipment } from './Equipment';
import { Engagement } from './Engagement';
import { BikeEvent } from './BikeEvent';

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

export class Security {
    @Column()
    frameNumber: string;

    @Column({
        nullable: true
    })
    keyNoFrameLock: string;

    @Column({
        nullable: true
    })
    keyNoAXAChain: string;

    @Column({
        nullable: true
    })
    policeCodeing: string;

    @Column({
        nullable: true
    })
    adfsCoding: string;
}

@Entity()
export class CargoBike extends Bike {
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

    @Column({
        type: 'simple-array',
        nullable: true
    })
    miscellaneousEquipment: string[];

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
    loanPeriods: TimeFrame[];

    // This relation is a little redundant because one could also check all LoanPeriods for current station
    @ManyToOne(type => LendingStation, lendingStation => lendingStation.cargoBikes, {
        nullable: true,
        eager: true
    })
    lendingStation: LendingStation;

    @OneToMany(type => Engagement, engagement => engagement.cargoBike)
    engagement: Engagement[];

    @Column(type => Taxes)
    taxes: Taxes;

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
