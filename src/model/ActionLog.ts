import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ActionLog {
    @PrimaryGeneratedColumn()
    id?: number;

    @CreateDateColumn()
    date?: Date;

    @Column()
    userId: number;

    @Column()
    entity: string;

    @Column({
        type: 'text'
    })
    entriesOld: string;

    @Column({
        type: 'text'
    })
    entriesNew: string;
}
