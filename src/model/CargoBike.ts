/* eslint no-unused-vars: "off" */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne } from 'typeorm';
import { Bike } from './BikeFeatures';
import { ChainSwap } from './ChainSwap';
import { Provider } from './Provider';
import { Participant } from './Participant';
import { InsuranceData } from './InsuranceData';
import { LoanPeriod } from './LoanPeriod';
import { LendingStation } from './LendingStation';
import { Taxes } from './Taxes';
import { Equipment } from './Equipment';

export enum Group {
    KL,
    LI,
    SP,
    FK,
    MH,
    SZ,
    TS,
    TK
}

export enum StickerBikeNameState {
    OK,
    IMPROVE,
    PRODUCED,
    NONEED,
    MISSING,
    UNKNOWN
}

@Entity()
export class CargoBike extends Bike {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    group: Group;

    @Column()
    name: string;

    @Column()
    serialNo: string;

    @OneToMany(type => Equipment, equipment => equipment.cargoBike, {
        nullable: true
    })
    equipment: Equipment[];

    @Column({
        nullable: true
    })
    otherEquipment: string;

    @OneToMany(type => ChainSwap, chainSwap => chainSwap.cargoBike, {
        nullable: true
    })
    chainSwaps: ChainSwap[]

    // Security information
    @Column()
    frameNumber: string;

    @Column()
    keyNoFrameLock: string;

    @Column()
    keyNoAXAChain: string;

    @Column()
    policeCodeing: string;

    @Column()
    adfsCoding: string;

    @Column({
        type: 'enum',
        enum: StickerBikeNameState
    })
    stickerBikeNameState: StickerBikeNameState;

    @Column()
    note: string;

    @ManyToOne(type => Provider, {
        nullable: true
    })
    provider: Provider;

    @ManyToOne(type => Participant, participant => participant.cargoBikes)
    coordinator: Participant;

    @Column(type => InsuranceData)
    insuranceData: InsuranceData;

    @OneToMany(type => LoanPeriod, loanPeriod => loanPeriod.cargoBike, {
        nullable: true
    })
    loanPeriods: LoanPeriod[];

    // This relation is a little redundant because one could also check all LoanPeriods for current station
    @ManyToOne(type => LendingStation, lendingStation => lendingStation.cargoBikes, {
        nullable: true
    })
    lendingStation: LendingStation;

    @Column(type => Taxes)
    taxes: Taxes;

    @Column({
        nullable: true
    })
    lockedBy: number;

    @Column({
        type: 'date',
        nullable: true
    })
    lockedUntil: Date;
}
