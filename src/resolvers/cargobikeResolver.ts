export default {
    Query: {
        CargobikeById: (_: any, { id, token }:{id: any, token: string}, { dataSources }:{dataSources: any}) =>
            dataSources.cargoBikeAPI.findCargoBikeById({ id, token })
    },
    Mutation: {
        addBike: (_:any, { id, token, name }:{id: any, token: string, name:string}, { dataSources }:{dataSources: any }) =>
            dataSources.cargoBikeAPI.updateBike({ id, token, name })
    }
}
