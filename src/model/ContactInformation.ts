import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

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

    @Column({
        nullable: true
    })
    note: string;
}
