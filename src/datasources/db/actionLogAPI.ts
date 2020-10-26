import { DataSource } from 'apollo-datasource';
import { Connection, getConnection } from 'typeorm';
import { ActionLog } from '../../model/ActionLog';

export class ActionLogAPI extends DataSource {
    connection : Connection
    constructor () {
        super();
        this.connection = getConnection();
    }

    async actionLogByUserId (userId: number) {
        return await this.connection.getRepository(ActionLog)
            .createQueryBuilder('al')
            .select()
            .where('"userId" = :uid', { uid: userId })
            .orderBy('date', 'DESC')
            .getMany();
    }

    async actionLogAll () {
        return await this.connection.getRepository(ActionLog)
            .createQueryBuilder('al')
            .select()
            .orderBy('date', 'DESC')
            .getMany();
    }
}
