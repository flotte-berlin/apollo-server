import { DataSource } from 'apollo-datasource'
import { Socket } from 'net'
import { PromiseSocket } from 'promise-socket'
import { RPCMessage } from './message'
import { Method } from './method'
import { GetInfoResponse, ValidateTokenResponse } from './responses'

/**
 * fetches datafrom user server, especially validates user tokens
 */
export class UserServerAPI extends DataSource {
    port: number
    host: string

    constructor (address: string) {
        super()
        const parts = address.split(':')
        this.host = parts[0]
        if (parts.length === 2) {
            this.port = Number(parts[1])
        } else {
            this.port = 5000
        }
    }

    async getInfo (): Promise<GetInfoResponse> {
        const response = await this.send<GetInfoResponse>(new RPCMessage(Method.Info, null))

        return response.data
    }

    /**
     * validates user token
     */
    async validateToken (token:string): Promise<boolean> {
        const response = await this.send<ValidateTokenResponse>(new RPCMessage(Method.ValidateToken, { token }))
        if (response) {
            return response.data[0]
        } else {
            return false
        }
    }

    /**
     * Connects to the socket and returns the client
     */
    async getSocket (): Promise<PromiseSocket<Socket>> {
        const socket = new Socket()
        const promiseSocket = new PromiseSocket(socket)
        await promiseSocket.connect(this.port, this.host)

        return promiseSocket
    }

    async send<T> (message: RPCMessage<any>): Promise<RPCMessage<T>> {
        const socket = await this.getSocket()
        await socket.writeAll(message.toBuffer())
        const response = await socket.readAll() as Buffer

        if (response?.length > 0) {
            return RPCMessage.fromBuffer<T>(response)
        }
    }
}
