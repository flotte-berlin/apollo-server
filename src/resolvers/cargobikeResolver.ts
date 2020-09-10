export default {
    Query: {
        cargobike: (_: any,{ id }:{id: any},{dataSources}:{dataSources: any}) =>
        dataSources.cargoBikeAPI.findCargoBikeById( { id } )
    },
};
