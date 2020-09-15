import { Column } from 'typeorm';

export abstract class Bike {
    @Column()
    description: string;

    @Column()
    modelName: string;

    @Column()
    numerOfWheels: number;

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

    @Column()
    bikeWidth: number;

    @Column()
    bikeHeight: number;

    @Column()
    bikeWeight: number;
}
