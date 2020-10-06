import { Connection, ObjectType } from 'typeorm';
import { CargoBike, Lockable } from '../../model/CargoBike';
import { GraphQLError } from 'graphql';

export function genDateRange (struct: any) {
    if (struct.to === undefined) {
        struct.to = '';
    }
    if (struct.to === undefined) {
        struct.to = '';
    }
    struct.dateRange = '[' + struct.from + ',' + struct.to + ')';
    if (struct.from === undefined) {
        delete struct.dateRange;
    }
}

/**
 * Can be used in resolvers to specify if entry is locked by other user.
 * Returns true if locked by other user.
 * @param parent
 * @param dataSources
 * @param req user request
 */
export function isLocked (parent: any, { dataSources, req }: { dataSources: any; req: any }) {
    return dataSources.userAPI.getUserId(LockUtils.getToken(req)).then((value: number) => {
        return value !== parent.lockedBy && new Date() <= new Date(parent.lockedUntil);
    });
}

export class LockUtils {
    static getToken (req: any) : string {
        return req.headers.authorization?.replace('Bearer ', '');
    }

    static async findById (connection: Connection, target: ObjectType<Lockable>, alias: string, id: number, userId: number): Promise<Lockable> {
        return await connection.getRepository(target)
            .createQueryBuilder(alias)
            .select()
            .where(alias + '.id = :id', { id: id })
            .getOne();
    }

    static async lockEntity (connection: Connection, target: ObjectType<Lockable>, alias: string, id: number, userId: number): Promise<Lockable> {
        const lock = await connection.getRepository(target)
            .createQueryBuilder(alias)
            .select([
                alias + '.lockedUntil',
                alias + '.lockedBy'
            ])
            .where('id = :id', {
                id: id
            })
            .andWhere(alias + '.lockedUntil > CURRENT_TIMESTAMP')
            .getOne();
        // eslint-disable-next-line eqeqeq
        if (!lock?.lockedUntil || lock?.lockedBy == userId) {
            // no lock -> set lock
            await connection.getRepository(target)
                .createQueryBuilder(alias)
                .update()
                .set({
                    lockedUntil: () => 'CURRENT_TIMESTAMP + INTERVAL \'10 MINUTE\'',
                    lockedBy: userId
                })
                .where('id = :id', { id: id })
                .execute();
            return await this.findById(connection, target, alias, id, userId);
        } else {
            // lock was set
            throw new GraphQLError('Entry locked by other user');
        }
    }

    static async unlockEntity (connection: Connection, target: ObjectType<Lockable>, alias: string, id: number, userId: number): Promise<boolean> {
        const lock = await connection.getRepository(target)
            .createQueryBuilder(alias)
            .select([
                alias + '.lockedUntil',
                alias + '.lockedBy'
            ])
            .where('id = :id', {
                id: id
            })
            .andWhere(alias + '.lockedUntil > CURRENT_TIMESTAMP')
            .getOne();
        if (!lock?.lockedUntil) {
            // no lock
            return true;
            // eslint-disable-next-line eqeqeq
        } else if (lock?.lockedBy == userId) {
            // user can unlock
            await connection.getRepository(target)
                .createQueryBuilder(alias)
                .update()
                .set({
                    lockedUntil: null,
                    lockedBy: null
                })
                .where('id = :id', { id: id })
                .execute();
            return true;
        } else {
            // entity is locked by other user
            return false;
        }
    }

    /**
     * Returns true if Entity is locked by another user.
     * @param connection
     * @param target
     * @param alias
     * @param id
     * @param req
     * @param dataSources
     */
    static async isLocked (connection: Connection, target: ObjectType<Lockable>, alias: string, id: number, userId: number) {
        const lock = await connection.getRepository(CargoBike)
            .createQueryBuilder(alias)
            .select([
                alias + '.lockedUntil',
                alias + '.lockedBy'
            ])
            .where('id = :id', {
                id: id
            })
            .andWhere(alias + '.lockedUntil > CURRENT_TIMESTAMP')
            .getOne();
        if (!lock?.lockedUntil) {
            // no lock
            return false;
            // eslint-disable-next-line eqeqeq
        } else return lock?.lockedBy != userId;
    }

    /**
     * Returns true if id is found in database
     * @param connection
     * @param target
     * @param alias
     * @param id
     */
    static async checkId (connection: Connection, target: ObjectType<Lockable>, alias: string, id: number) {
        const result = await connection.getRepository(target)
            .createQueryBuilder(alias)
            .select([
                alias + '.id'
            ])
            .where('id = :id', { id: id })
            .getCount();
        return result === 1;
    }
}
