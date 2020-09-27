import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CargoBike, Lockable } from './CargoBike';

@Entity()
export class EquipmentType implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: 'text',
        default: ''
    })
    description: string;

    @ManyToMany(type => CargoBike, cargoBike => cargoBike.equipmentTypeIds)
    cargoBikeIds: number[];

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
