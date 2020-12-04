import { ApolloError } from 'apollo-server-express';

export class NotFoundError extends ApolloError {
    constructor (type: string, identifierParam: string, identifierValue: any) {
        super(`${type} with ${identifierParam} = '${identifierValue}' not found.`, 'ENTITY_NOT_FOUND');
    }
}
