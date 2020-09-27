import { Lockable } from './CargoBike';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Workshop } from './Workshop';

@Entity()
export class WorkshopType implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Workshop, workshop => workshop.workshopTypeId)
    workshopIds: number[];

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
