import { GraphQLError } from 'graphql';
import { Permission } from '../datasources/userserver/permission';

export default {
    ContactPerson: {
        contactInformation: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.contactInformationAPI.contactInformationByContactPersonId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    },
    Mutation: {
        createContactPerson: (_: any, { contactPerson }: { contactPerson: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.contactInformationAPI.createContactPerson(contactPerson);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateContactPerson: (_: any, { contactPerson }: { contactPerson: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteBike)) {
                return dataSources.contactInformationAPI.updateContactPerson(contactPerson);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
