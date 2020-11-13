/*
Copyright (C) 2020  trivernis

This file is part of fLotte-API-Server.

    fLotte-API-Server is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    fLotte-API-Server is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with fLotte-API-Server.  If not, see <https://www.gnu.org/licenses/>.
*/

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
