/* eslint no-unused-vars: "off" */

import { PrimaryGeneratedColumn, Column, OneToMany, Entity, OneToOne } from 'typeorm';
import { ContactInformation } from './ContactInformation';
import { LendingStation } from './LendingStation';
import { Organization } from './Organization';

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

    @Column()
    street: string;

    @Column()
    number: string;

    @Column()
    zip: string;

    @OneToMany(type => ContactInformation, contactInformation => contactInformation.provider)
    contactInformation: ContactInformation[];

    @Column()
    isPrivatePerson: boolean;

    @OneToOne(type => Organization, organization => organization.provider, {
        nullable: true
    })
    organization: Organization;
}
