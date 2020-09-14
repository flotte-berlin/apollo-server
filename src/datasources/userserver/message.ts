import { encode, decode } from 'messagepack';
import { Method } from './method';
import { crc32 } from 'crc';

export class RPCMessage<T> {
    private readonly method: Method
    readonly data: T

    constructor (method: Method, data: any) {
        this.method = method;
        this.data = data;
    }

    static fromBuffer<T> (raw: Buffer): RPCMessage<T> {
        const length = raw.readUInt32BE();
        if (raw.length !== length) {
            throw new Error('Invalid Buffer length');
        }
        const crcNum = raw.readUInt32BE(length - 4);

        if (crc32(raw.slice(0, length - 4)) !== crcNum) {
            throw new Error('Validation check failed');
        }
        const method = raw.readUInt32BE(4);
        const msgData = decode(raw.slice(8, length));

        return new RPCMessage(method, msgData);
    }

    public toBuffer (): Buffer {
        const msgData = encode(this.data);
        const length = msgData.length + 12;
        const buffer = Buffer.alloc(length - 4);
        buffer.writeUInt32BE(length);
        buffer.writeUInt32BE(this.method, 4);
        buffer.fill(msgData, 8);
        const crcNum = crc32(buffer);
        const resultBuffer = Buffer.alloc(length, buffer);
        resultBuffer.writeUInt32BE(crcNum, length - 4);

        return resultBuffer;
    }
}
