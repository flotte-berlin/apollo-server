function gql (strings: TemplateStringsArray) {
}

export const CREATE_CARGO_BIKE = gql`
    mutation {
        createCargoBike(
            cargoBike: {
                group: KL
                name: "Test"
                modelName: "cool"
                numberOfWheels: 1
                forCargo: true
                forChildren: false
                numberOfChildren: 2
                technicalEquipment: {
                    bicycleShift: "shift"
                    isEBike: false
                    hasLightSystem:false
                }
                dimensionsAndLoad: {
                    hasCoverBox: true
                    lockable:false
                    boxLength: 0.1
                    boxWidth: 0.2
                    boxHeight:0.3
                    maxWeightBox: 1.1
                    maxWeightLuggageRack: 1.2
                    maxWeightTotal: 1.3
                    bikeLength:2.1
                }
                security: {frameNumber: "bla"}
                insuranceData: {name:"in"
                    benefactor: "ben"
                    billing: "bill"
                    noPnP: "noP"

                    maintenanceResponsible: "someone"
                    maintenanceBenefactor: "mben"
                    hasFixedRate: true}
                taxes: {costCenter:"cost"}
            }
        ) {
            id
            insuranceData{
                maintenanceResponsible
            }
            equipmentType {
                id
                name
            }
            provider {
                id
                organisation{
                    id
                }
            }
            lendingStation {
                id
                name
                cargoBikes {
                    id
                }
            }
        }
    }`;
export const GET_CARGO_BIKE = gql`{
    cargoBikes(offset: 0, limit: 1) {
        id
    }
}`;
