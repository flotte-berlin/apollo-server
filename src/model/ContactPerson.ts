import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ContactInformation } from './ContactInformation';
import { LendingStation } from './LendingStation';
import { Provider } from './Provider';

@Entity()
export class ContactPerson {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => ContactInformation)
    contactInformation: ContactInformation;

    @ManyToMany(type => LendingStation, lendingStation => lendingStation.contactPersons, {
        nullable: true
    })
    lendingStation: LendingStation;

    @ManyToMany(type => Provider, provider => provider.contactPersons, {
        nullable: true
    })
    provider: Provider[];

    @Column({
        type: 'boolean'
    })
    intern: boolean;
}
