import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { ContactInformation } from './ContactInformation';
import { LoanPeriod } from './LoanPeriod';
import { CargoBike } from './CargoBike';
import { Organization } from './Organization';

@Entity()
export class LendingStation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => ContactInformation)
    @JoinTable()
    contactInformation: ContactInformation[];

    @Column()
    addressStreet: string;

    @Column()
    addressStreetNo: string;

    @Column()
    addressZip: string;

    @OneToMany(type => LoanPeriod, loanPeriod => loanPeriod.lendingStation)
    loanPeriods: LoanPeriod[];

    @OneToMany(type => CargoBike, cargoBike => cargoBike.lendingStation)
    cargoBikes: CargoBike[];

    @ManyToOne(type => Organization, organization => organization.lendingStations)
    organization: Organization;
}
