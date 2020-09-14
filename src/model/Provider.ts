/* eslint no-unused-vars: "off" */

import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from 'typeorm';
import { ContactInformation } from './ContactInformation';

@Entity()
export class Provider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    formularName: String;

    @Column()
    street: string;

    @Column()
    number: string;

    @Column()
    zip: string;

    @Column()
    registerdAt: string;

    @Column()
    registerNo: string;

    @OneToMany(type => ContactInformation, contactInformation => contactInformation.provider)
    contactInformation: ContactInformation[];
}
