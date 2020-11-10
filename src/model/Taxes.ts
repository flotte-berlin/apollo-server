/* eslint no-unused-vars: "off" */
import { Column } from 'typeorm';

export enum OrganisationArea {
    IB = 'IB',
    ZB = 'ZB'
}
export class Taxes {
    @Column()
    costCenter: string;

    @Column({
        type: 'enum',
        enum: OrganisationArea,
        nullable: true
    })
    organisationArea: OrganisationArea;
}
