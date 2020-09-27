import { Lockable } from './CargoBike';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContactInformation } from './ContactInformation';

@Entity()
export class Person implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    name: string;

    @OneToMany(type => ContactInformation, contactInformation => contactInformation.personId)
    contactInformationIds: number[];

    @Column({
        nullable: true
    })
    lockedUntil: Date;

    @Column({
        nullable: true
    })
    lockedBy: number;
}
