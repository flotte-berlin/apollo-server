import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { TimeFrame } from './TimeFrame';
import { Organisation } from './Organisation';
import { Address } from './Provider';
import { ContactInformation } from './ContactInformation';
import { Lockable } from './CargoBike';

export class LoanPeriod {
    /**
     * validity for loanPeriods
     */
    @Column({
        nullable: true,
        type: 'date'
    })
    from: Date;

    /**
     * validity for loanPeriods
     */
    @Column({
        nullable: true,
        type: 'date'
    })
    to: Date;

    @Column({
        type: 'simple-array',
        nullable: true
    })
    loanTimes: string[];
}

@Entity()
export class LendingStation implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => ContactInformation)
    @JoinColumn({
        name: 'contactInformationInternId'
    })
    contactInformationInternId: number;

    @ManyToOne(type => ContactInformation)
    @JoinColumn({
        name: 'contactInformationExternId'
    })
    contactInformationExternId: number;

    @Column(type => Address)
    address: Address;

    @Column(type => LoanPeriod)
    loanPeriod: LoanPeriod;

    @OneToMany(type => TimeFrame, timeFrame => timeFrame.lendingStationId)
    timeFrames: TimeFrame[];

    @ManyToOne(type => Organisation, organization => organization.lendingStations)
    @JoinColumn({
        name: 'organisationId'
    })
    organisationId: number;

    @Column({
        nullable: true,
        type: 'timestamp'
    })
    lockedUntil: Date;

    @Column({
        nullable: true
    })
    lockedBy: number;
}
