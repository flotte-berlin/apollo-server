import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { TimeFrame } from './TimeFrame';
import { CargoBike } from './CargoBike';
import { Organisation } from './Organisation';
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

    @ManyToOne(type => Organisation, organization => organization.lendingStations)
    organization: Organisation;
}
