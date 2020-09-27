import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Lockable } from './CargoBike';
import { Person } from './Person';
import { Address } from './Provider';
import { Participant } from './Participant';

@Entity()
export class ContactInformation implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Person, person => person.contactInformationIds, {
        nullable: false

    })
    @JoinColumn({
        name: 'personId'
    })
    personId: number;

    @OneToOne(type => Participant, participant => participant.contactInformationId, {
        nullable: true
    })
    participantId: number;

    @Column(type => {
        return Address;
    })
    address: Address;

    @Column({
        nullable: true
    })
    phone: string;

    @Column({
        nullable: true
    })
    phone2: string;

    @Column({
        nullable: true
    })
    email: string;

    @Column({
        nullable: true
    })
    email2: string;

    @Column({
        nullable: true
    })
    note: string;

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
