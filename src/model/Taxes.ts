/* eslint no-unused-vars: "off" */
import { Column } from 'typeorm';

export enum OrganizationArea {
    IB = 'IB',
    ZB = 'ZB'
}
export class Taxes {
    @Column()
    costCenter: string;

    @Column({
        type: 'enum',
        enum: OrganizationArea,
        nullable: true
    })
    organizationArea: OrganizationArea;
}
