import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CargoBike } from './CargoBike';

@Entity()
export class Equipment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    serialNo: string;

    @OneToMany(type => CargoBike, cargoBike => cargoBike.equipment, {
        nullable: true
    })
    cargoBike: CargoBike;
}
