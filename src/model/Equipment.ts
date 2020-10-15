import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { CargoBike, Lockable } from './CargoBike';

@Entity()
export class Equipment implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    serialNo: string;

    @Column()
    title: string;

    @Column({
        nullable: true
    })
    description: string;

    @ManyToOne(type => CargoBike, cargoBike => cargoBike.equipment, {
        nullable: true
    })
    @JoinColumn({
        name: 'cargoBikeId', referencedColumnName: 'id'
    })
    cargoBike: CargoBike;

    @Column({
        type: 'timestamp',
        nullable: true
    })
    lockedUntil: Date;

    @Column({
        nullable: true
    })
    lockedBy: number;
}
