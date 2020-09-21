import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { LoanPeriod } from './LoanPeriod';
import { CargoBike } from './CargoBike';
import { Organization } from './Organization';
import { Address } from './Provider';
import { ContactPerson } from './ContactPerson';

@Entity()
export class LendingStation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => ContactPerson)
    @JoinTable()
    contactPersons: ContactPerson[];

    @Column(type => Address)
    address: Address;

    @OneToMany(type => LoanPeriod, loanPeriod => loanPeriod.lendingStation)
    loanPeriods: LoanPeriod[];

    @OneToMany(type => CargoBike, cargoBike => cargoBike.lendingStation, {
        eager: false
    })
    cargoBikes: CargoBike[];

    @ManyToOne(type => Organization, organization => organization.lendingStations)
    organization: Organization;
}
