import { ApolloError } from 'apollo-server-express';

export class ResourceLockedError extends ApolloError {
    constructor (resourceName: String, additionalContext?: string) {
        if (additionalContext) {
            super(`The Resource ${resourceName} is currently locked: ${additionalContext}`, 'LOCKED_ERROR');
        } else {
            super(`The Resource ${resourceName} is currently locked`, 'LOCKED_ERROR');
        }
    }
}
