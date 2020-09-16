import { Column } from 'typeorm';

export class TechnicalEquipment {
    @Column()
    bicycleShift: string;

    @Column()
    isEBike: boolean;

    @Column()
    hasLightSystem: boolean;

    @Column({
        nullable: true
    })
    specialFeatures: string;
}

export class DimensionsAndLoad {
    @Column()
    hasCoverBox: boolean;

    @Column()
    lockable:boolean;

    @Column({
        type: 'decimal'
    })
    boxLength: number;

    @Column({
        type: 'decimal'
    })
    boxWidth: number;

    @Column({
        type: 'decimal'
    })
    boxHeight: number;

    @Column({
        type: 'decimal'
    })
    maxWeightBox: number;

    @Column({
        type: 'decimal'
    })
    maxWeightLuggageRack: number;

    @Column({
        type: 'decimal'
    })
    maxWeightTotal: number;

    @Column({
        type: 'decimal'
    })
    bikeLength: number;

    @Column({
        nullable: true,
        type: 'decimal'

    })
    bikeWidth: number;

    @Column({
        nullable: true,
        type: 'decimal'

    })
    bikeHeight: number;

    @Column({
        nullable: true,
        type: 'decimal'

    })
    bikeWeight: number;
}

export abstract class Bike {
    @Column({
        nullable: true
    })
    description: string;

    @Column()
    modelName: string;

    @Column()
    numberOfWheels: number;

    @Column()
    forCargo: boolean;

    @Column()
    forChildren: boolean;

    @Column()
    numberOfChildren: number;

    @Column(type => TechnicalEquipment)
    technicalEquipment: TechnicalEquipment;

    @Column(type => DimensionsAndLoad)
    dimensionsAndLoad: DimensionsAndLoad;
}
