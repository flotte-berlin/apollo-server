import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { Bike } from './BikeFeatures';

@Entity()
export class BikeModel extends Bike {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
