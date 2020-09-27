import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { TimeFrame } from './TimeFrame';
import { Organisation } from './Organisation';
import { Address } from './Provider';
import { ContactInformation } from './ContactInformation';

@Entity()
export class LendingStation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => ContactInformation)
    contactInformationIntern: ContactInformation;

    @ManyToOne(type => ContactInformation)
    contactInformationExtern: ContactInformation;

    @Column(type => Address)
    address: Address;

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

    @OneToMany(type => TimeFrame, loanPeriod => loanPeriod.lendingStation)
    loanPeriods: TimeFrame[];

    @ManyToOne(type => Organisation, organization => organization.lendingStations)
    organization: Organisation;
}
