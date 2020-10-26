/* eslint no-unused-vars: "off" */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Actions {
    UPDATE='UPDATE',
    SOFT_DELETE='SOFT_DELETE',
    DELETE='DELETE',
    RESTORE='RESTORE',
}

@Entity()
export class ActionLog {
    @PrimaryGeneratedColumn()
    id?: number;

    @CreateDateColumn()
    date?: Date;

    @Column()
    action: string;

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
