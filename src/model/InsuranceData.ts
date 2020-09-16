import { Column } from 'typeorm';

export class InsuranceData {
    @Column()
    name: string;

    @Column()
    benefactor: string;

    @Column()
    billing: string;

    @Column()
    noPnP: string;

    @Column()
    maintananceResponsible: string;

    @Column()
    maintananceBenefactor: string;

    @Column({
        nullable: true
    })
    maintananceAgreement: string;

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
