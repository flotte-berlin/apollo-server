import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CargoBike } from './CargoBike';

@Entity()
export class ChainSwap {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mechanic: string;

    @Column({
        type: 'date'
    })
    time: Date;

    @Column()
    kexNoOldAXAChain: string;

    @ManyToOne(type => CargoBike, cargoBike => cargoBike.chainSwaps)
    cargoBike: CargoBike;
}
