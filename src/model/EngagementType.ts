import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Lockable } from './CargoBike';
import { Engagement } from './Engagement';

@Entity()
export class EngagementType implements Lockable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @OneToMany(type => Engagement, engagement => engagement.engagementTypeId)
    engagementIds: number[];

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
