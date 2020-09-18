import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CargoBike } from './CargoBike';

@Entity()
export class Equipment {
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

    @OneToMany(type => CargoBike, cargoBike => cargoBike.equipment, {
        nullable: true
    })
    cargoBike: CargoBike;
}
