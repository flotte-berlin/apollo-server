import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from 'typeorm';
import { Provider } from './Provider';

@Entity()
export class ContactInformation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    firstName: string;

    @Column({
        type: 'date',
        nullable: true
    })
    retiredAt: Date;

    @Column({
        nullable: true
    })
    phoneExtern: string;

    @Column({
        nullable: true
    })
    phone2Extern: string;

    @Column({
        nullable: true
    })
    phoneIntern: string;

    @Column({
        nullable: true
    })
    phone2Intern: string;

    @Column({
        nullable: true
    })
    emailExtern: string;

    @Column({
        nullable: true
    })
    emailIntern: string;

    @Column()
    note: string;

    @ManyToOne(type => Provider, provider => provider.contactInformation)
    provider: Provider;
}
