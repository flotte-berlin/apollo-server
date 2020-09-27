import { Lockable } from './CargoBike';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BikeEventType implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

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
