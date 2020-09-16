import { Column } from 'typeorm';

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

    // technical Information
    @Column()
    bicycleShift: string;

    @Column()
    isEBike: boolean;

    @Column()
    hasLightSystem: boolean;

    @Column()
    specialFeatures: string;

    // dimensions and load
    @Column()
    hasCoverBox: boolean;

    @Column()
    lockable:boolean;

    @Column()
    boxLength: number;

    @Column()
    boxWidth: number;

    @Column()
    boxHeight: number;

    @Column()
    maxWeightBox: number;

    @Column()
    maxWeightLuggageRack: number;

    @Column()
    maxWeightTotal: number;

    @Column()
    bikeLength: number;

    @Column({
        nullable: true
    })
    bikeWidth: number;

    @Column({
        nullable: true
    })
    bikeHeight: number;

    @Column({
        nullable: true
    })
    bikeWeight: number;
}
