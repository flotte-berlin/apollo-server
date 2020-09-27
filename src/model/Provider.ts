/* eslint no-unused-vars: "off" */

import { PrimaryGeneratedColumn, Column, OneToMany, Entity, OneToOne, ChildEntity, ManyToOne, JoinColumn } from 'typeorm';
import { CargoBike, Lockable } from './CargoBike';
import { ContactInformation } from './ContactInformation';
import { Organisation } from './Organisation';

export class Address {
    @Column({
        default: ''
    })
    street: string;

    @Column({
        default: ''
    })
    number: string;

    @Column({
        default: ''
    })
    zip: string;

    @Column({
        default: ''
    })
    city: string;
}

@Entity()
export class Provider implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    formName: String;

    // is null when Provider is an organisation
    @OneToOne(type => ContactInformation, {
        nullable: true
    })
    @JoinColumn()
    contactInformationId: number;

    // is null when Provider is a private Person
    @OneToOne(type => Organisation, organization => organization.providerId, {
        nullable: true
    })
    @JoinColumn({
        name: 'organisationId'
    })
    organisationId: number;

    @OneToMany(type => CargoBike, cargoBike => cargoBike.provider)
    cargoBikes: CargoBike[];

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
