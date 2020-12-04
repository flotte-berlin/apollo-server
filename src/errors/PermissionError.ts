import { ApolloError } from 'apollo-server-express';

export class PermissionError extends ApolloError {
    constructor () {
        super('Insufficient permissions.', 'INSUFFICIENT_PERMISSIONS');
    }
}
