/* eslint no-unused-vars: "off" */

import { PrimaryGeneratedColumn, Column, OneToMany, Entity, OneToOne } from 'typeorm';
import { ContactInformation } from './ContactInformation';
import { LendingStation } from './LendingStation';
import { Organization } from './Organization';

export class Address {
    @Column()
    street: string;

    @Column()
    number: string;

    @Column()
    zip: string;
}

@Entity()
export class Provider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        nullable: false
    })
    formularName: String;

    @Column(type => Address)
    address: Address;

    @OneToMany(type => ContactInformation, contactInformation => contactInformation.provider)
    contactInformation: ContactInformation[];

    @Column()
    isPrivatePerson: boolean;

    @OneToOne(type => Organization, organization => organization.provider, {
        nullable: true
    })
    organization: Organization;
}
