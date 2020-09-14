/* eslint no-unused-vars: "off" */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne } from 'typeorm';
import { Bike } from './BikeFeatures';
import { ChainSwap } from './ChainSwap';
import { Provider } from './Provider';
import { Participant } from './Participant';
import { InsuranceData } from './InsuranceData';

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

    @OneToMany(type => ChainSwap, chainSwap => chainSwap.cargoBike)
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

    @ManyToOne(type => Provider)
    provider: Provider;

    @ManyToOne(type => Participant, participant => participant.cargoBikes)
    coordinator: Participant;

    @OneToOne(type => InsuranceData)
    insuranceData: InsuranceData;
}
