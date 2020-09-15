import { Column } from 'typeorm';

export class InsuranceData {
    @Column()
    name: string;

    @Column()
    benefector: string;

    @Column()
    noPnP: string;

    @Column()
    maintananceResponisble: string;

    @Column()
    maintanceBenfector: string;

    @Column({
        nullable: true
    })
    maintanceAgreement: string;

    @Column({
        nullable: true
    })
    hasFixedRate: boolean;

    @Column({
        nullable: true
    })
    fixedRate: number;

    @Column({
        type: 'money',
        nullable: true
    })
    projectAllowance: number;

    @Column({
        nullable: true
    })
    note: string;
}
