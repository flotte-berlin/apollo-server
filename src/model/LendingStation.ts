import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { TimeFrame } from './TimeFrame';
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

    @OneToMany(type => CargoBike, cargoBike => cargoBike.lendingStation, {
        eager: false
    })
    cargoBikes: CargoBike[];

    @ManyToOne(type => Organization, organization => organization.lendingStations)
    organization: Organization;
}
