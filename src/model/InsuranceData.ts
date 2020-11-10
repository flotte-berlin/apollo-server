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
    maintenanceResponsible: string;

    @Column()
    maintenanceBenefactor: string;

    @Column({
        nullable: true
    })
    maintenanceAgreement: string;

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
    notes: string;
}
