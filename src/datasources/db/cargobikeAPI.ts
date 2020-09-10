import { DataSource } from 'apollo-datasource';

/**
 * extended datasource to feed resolvers with data about cargoBikes
 */
export class CargoBikeAPI extends DataSource {
    constructor() {
        super();
        // this.store = store;
    }
    /**
     * Finds cargo bike by id
     */
    async findCargoBikeById({ id }:{id: any}){
      return {
            id,
            name: "hello world"
      };
  }
}