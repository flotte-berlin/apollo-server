import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class CargoBike {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;
}
