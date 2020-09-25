/* eslint no-unused-vars: "off" */

import { PrimaryGeneratedColumn, Column, OneToMany, Entity, OneToOne, ChildEntity } from 'typeorm';
import { CargoBike } from './CargoBike';
import { ContactInformation } from './ContactInformation';
import { ContactPerson } from './ContactPerson';
import { LendingStation } from './LendingStation';
import { Organisation } from './Organisation';

export class Address {
    @Column()
    street: string;

    @Column()
    number: string;

    @Column()
    zip: string;

    @Column({
        nullable: true
    })
    city: string;
}

@Entity()
export class Provider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    formName: String;

    @OneToMany(type => ContactPerson, contactPerson => contactPerson.provider, {
        nullable: true
    })
    contactPersons: ContactPerson[];

    @OneToMany(type => CargoBike, cargoBike => cargoBike.provider)
    cargoBikes: CargoBike[];

    @Column()
    isPrivatePerson: boolean;

    @OneToOne(type => Organisation, organization => organization.provider, {
        nullable: true
    })
    organization: Organisation;
}
