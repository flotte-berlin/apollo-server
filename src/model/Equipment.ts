import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { CargoBike } from './CargoBike';

@Entity()
export class Equipment {
    setValues ({ id, serialNo, title, description, cargoBike }: {
        id: number,
        serialNo: string,
        title: string,
        description: string,
        cargoBike: CargoBike
    }) {
        this.id = id;
        this.serialNo = serialNo;
        this.title = title;
        this.description = description;
        this.cargoBike = cargoBike;
    }

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

    cargoBikeId: number;
}
