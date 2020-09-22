import { DataSource } from 'apollo-datasource';
import { Socket } from 'net';
import { PromiseSocket } from 'promise-socket';
import { RPCMessage } from './message';
import { Method } from './method';
import {
    CreateRoleResponse,
    GetInfoResponse,
    GetRolesPermissionsResponse,
    GetRolesResponse,
    ValidateTokenResponse
} from './responses';
import { requiredPermissions } from './permission';

/**
 * fetches datafrom user server, especially validates user tokens
 */
export class UserServerAPI extends DataSource {
    port: number
    host: string

    constructor (address: string) {
        super();
        const parts = address.split(':');
        this.host = parts[0];
        if (parts.length === 2) {
            this.port = Number(parts[1]);
        } else {
            this.port = 5000;
        }
    }

    /**
     * Returns the information about all available rpc methods
     */
    async getInfo (): Promise<GetInfoResponse> {
        const response = await this.send<GetInfoResponse>(new RPCMessage(Method.Info, null));

        return response.data;
    }

    /**
     * Creates required API permissions
     */
    async createDefinedPermissions () {
        await this.send<any>(new RPCMessage(Method.CreatePermissions, { permissions: requiredPermissions }));
    }

    /**
     * Creates a new role with the given parameters
     * @param name - the name of the role
     * @param description - a description of the role
     * @param permissionIDs - an array of IDs the role is created with
     */
    async createRole (name: string, description: string, permissionIDs: number[]): Promise<CreateRoleResponse> {
        const response = await this.send<CreateRoleResponse>(new RPCMessage<any>(Method.CreateRole, {
            name,
            description,
            permissions: permissionIDs
        }));

        return response.data;
    }

    /**
     * validates user token
     */
    async validateToken (token:string): Promise<boolean> {
        const response = await this.send<ValidateTokenResponse>(new RPCMessage(Method.ValidateToken, { token }));
        if (response) {
            return response.data[0];
        } else {
            return false;
        }
    }

    /**
     * Returns a list of roles the user is assigned to
     * @param token
     */
    async getUserRoles (token: String): Promise<GetRolesResponse> {
        const response = await this.send<any>(new RPCMessage(Method.GetRoles, { token }));
        return response.data;
    }

    /**
     * Returns userId
     * @param token
     */
    async getUserId (token: String): Promise<number> {
        const response = await this.send<any>(new RPCMessage(Method.GetUserID, { token }));
        return response.data;
    }

    /**
     * Returns all permissions of the user
     * @param token
     */
    async getUserPermissions (token: String): Promise<string[]> {
        const roles = await this.getUserRoles(token);
        const roleIds = roles.map(role => role[0]);
        const permissionsResponse = await this.send<GetRolesPermissionsResponse>(new RPCMessage(Method.GetRolePermissions, { roles: roleIds }));
        const permissions: string[] = [];

        for (const id of roleIds) {
            permissions.push(...permissionsResponse.data[id].map(entry => entry[1]));
        }

        return permissions;
    }

    /**
     * Connects to the socket and returns the client
     */
    async getSocket (): Promise<PromiseSocket<Socket>> {
        const socket = new Socket();
        const promiseSocket = new PromiseSocket(socket);
        await promiseSocket.connect(this.port, this.host);

        return promiseSocket;
    }

    /**
     * Sends a message and reads and parses the response of it
     * @param message
     */
    async send<T> (message: RPCMessage<any>): Promise<RPCMessage<T>> {
        const socket = await this.getSocket();
        await socket.writeAll(message.toBuffer());
        const response = await socket.readAll() as Buffer;

        if (response?.length > 0) {
            return RPCMessage.fromBuffer<T>(response);
        }
    }
}
