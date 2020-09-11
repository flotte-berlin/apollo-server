export default {
    Query: {
        cargobike: (_: any, { id, token }:{id: any, token: string}, { dataSources }:{dataSources: any}) =>
            dataSources.cargoBikeAPI.findCargoBikeById({ id, token })
    }
}
