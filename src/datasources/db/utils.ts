/*
Copyright (C) 2020  Leon Löchner

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

import { Connection, EntityManager, ObjectType } from 'typeorm';
import { Lockable } from '../../model/CargoBike';
import { ActionLog, Actions } from '../../model/ActionLog';
import { UserInputError } from 'apollo-server-express';

export function genDateRange (struct: any) {
    if (struct.to === undefined) {
        struct.to = '';
    }
    struct.dateRange = '[' + struct.from + ',' + struct.to + ')';
    if (struct.from === undefined) {
        delete struct.dateRange;
    }
    // delete these keys, so the struct can be used to update the engagement entity
    delete struct.from;
    delete struct.to;
}

/**
 * This function helps prepare the cargoBike struct, to be used in an update or create.
 * It creates the numrange attributes than can be understood by postgres.
 * @param from
 * @param to
 */
function genNumRange (from: number, to: number) {
    if (from === null || from === undefined) {
        from = to;
    } else if (to === null || to === undefined) {
        to = from;
    }
    return from ? '[' + from + ',' + to + ']' : null;
}

/**
 * This function prepares the cargoBike struct, to be used in an update or create.
 * It creates the numrange attributes than can be understood by postgres.
 * @param cargoBike
 */
export function genBoxDimensions (cargoBike: any) {
    cargoBike.dimensionsAndLoad.boxLengthRange = genNumRange(cargoBike.dimensionsAndLoad.minBoxLength, cargoBike.dimensionsAndLoad.maxBoxLength);
    cargoBike.dimensionsAndLoad.boxWidthRange = genNumRange(cargoBike.dimensionsAndLoad.minBoxWidth, cargoBike.dimensionsAndLoad.maxBoxWidth);
    cargoBike.dimensionsAndLoad.boxHeightRange = genNumRange(cargoBike.dimensionsAndLoad.minBoxHeight, cargoBike.dimensionsAndLoad.maxBoxHeight);
    // delete this so update cargo bike works
    delete cargoBike.dimensionsAndLoad.minBoxLength;
    delete cargoBike.dimensionsAndLoad.maxBoxLength;
    delete cargoBike.dimensionsAndLoad.minBoxWidth;
    delete cargoBike.dimensionsAndLoad.maxBoxWidth;
    delete cargoBike.dimensionsAndLoad.minBoxHeight;
    delete cargoBike.dimensionsAndLoad.maxBoxHeight;
}

/**
 * Can be used in resolvers to specify, if entry is locked by other user.
 * Returns true if locked by other user.
 * @param parent
 * @param req
 */
export function isLocked (parent: any, { req }: { req: any }) {
    return req.userId !== parent.lockedBy && new Date() <= new Date(parent.lockedUntil);
}

/**
 * Can be used in resolvers to specify, if entry is locked by the current user.
 * @param parent
 * @param req
 */
export function isLockedByMe (parent: any, { req }: { req: any }) {
    return req.userId === parent.lockedBy && new Date() <= new Date(parent.lockedUntil);
}

/**
 * Some utility functions for the database
 */
export class DBUtils {
    /**
     * Delete any instance of an entity that implements the Lockable interface.
     * It must implement the interface, so it can be be ensured, that the instance is not locked by another user.
     * @param connection
     * @param target
     * @param alias
     * @param id
     * @param userId
     */
    static async deleteEntity (connection: Connection, target: ObjectType<Lockable>, alias: string, id: number, userId: number): Promise<Boolean> {
        return await connection.transaction(async (entityManger: EntityManager) => {
            if (await LockUtils.isLocked(entityManger, target, alias, id, userId)) {
                throw new UserInputError('Attempting to delete locked resource');
            }
            await ActionLogger.log(entityManger, target, alias, { id: id }, userId, Actions.DELETE);
            return await entityManger.getRepository(target)
                .createQueryBuilder(alias)
                .delete()
                .where('id = :id', { id: id })
                .execute().then(value => value.affected === 1);
        });
    }

    /**
     * Return all instances of the given entity called target.
     * When offset or limit is not specified, both values are ignored.
     * @param connection
     * @param target
     * @param alias
     * @param offset
     * @param limit
     */
    static async getAllEntity (connection: Connection, target: ObjectType<any>, alias: string, offset?: number, limit?: number) {
        if (offset === null || limit === null) {
            return await connection.getRepository(target)
                .createQueryBuilder(alias)
                .select()
                .getMany();
        } else {
            return await connection.getRepository(target)
                .createQueryBuilder(alias)
                .select()
                .skip(offset)
                .take(limit)
                .getMany();
        }
    }
}

/**
 * Some static functions for the locking feature.
 */
export class LockUtils {
    /**
     * A helper function to find an instance of any entity that implements Lockable.
     * It will throw an error, if nothing is found.
     * Using this function only makes sense to use in the context of locking because there is no point in locking
     * an instance that does not exist.
     * @param connection
     * @param target
     * @param alias
     * @param id
     * @private
     */
    private static async findById (connection: Connection, target: ObjectType<Lockable>, alias: string, id: number): Promise<Lockable> {
        return await connection.getRepository(target)
            .createQueryBuilder(alias)
            .select()
            .where(alias + '.id = :id', { id: id })
            .getOne().catch(() => {
                throw new UserInputError('ID not found');
            });
    }

    /**
     * Lock an instance of an entity target that implements the Lockable interface and return that instance.
     * If lock could not be set, it will still return the entity.
     * If lock was set or not can be obtained by the field isLockedByMe in the graphql interface,
     * or the the fields lockedBy and lockedUntil in the database.
     * @param connection
     * @param target
     * @param alias
     * @param id
     * @param userId
     */
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
        }
        return await this.findById(connection, target, alias, id);
    }

    /**
     * Unlock an instance of an entity target that implements the Lockable interface and return that instance.
     * If lock could not be unset, it will still return the entity.
     * If lock was set or not can be obtained by the field isLockedByMe in the graphql interface,
     * or the the fields lockedBy and lockedUntil in the database.
     * @param connection
     * @param target
     * @param alias
     * @param id
     * @param userId
     */
    static async unlockEntity (connection: Connection, target: ObjectType<Lockable>, alias: string, id: number, userId: number): Promise<Lockable> {
        await connection.getRepository(target)
            .createQueryBuilder(alias)
            .update()
            .set({
                lockedUntil: null,
                lockedBy: null
            })
            .where('id = :id', { id: id })
            .andWhere('lockedBy = :uid OR lockedUntil < CURRENT_TIMESTAMP', { uid: userId })
            .execute();
        return await this.findById(connection, target, alias, id);
    }

    /**
     * Returns true if Entity is locked by another user.
     * @param connection
     * @param target
     * @param alias
     * @param id
     * @param userId
     */
    static async isLocked (connection: EntityManager, target: ObjectType<Lockable>, alias: string, id: number, userId: number) {
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
            return false;
            // eslint-disable-next-line eqeqeq
        } else return lock?.lockedBy != userId;
    }
}

/**
 * Some utility function for the logging features.
 */
export class ActionLogger {
    /**
     * Create array of strings, that can be used to select them form the database.
     * If you want to avoid logging all old values, for an update, but only the ones that are updated,
     * use this function. If updates are null, ['*'] will be returned. Use this for delete actions.
     * @param updates
     * @param alias
     * @private
     */
    private static buildSelect (updates: any, alias: string) : string[] {
        // this hacky shit makes it possible to select subfields like the address or insurance data. Only one layer at the moment
        if (updates === null) {
            return ['*'];
        }
        const ret :string[] = [];
        Object.keys(updates).forEach(value => {
            // sometimes updates[value] is an array, e.g. timePeriods that are saved as a simple array in postgres
            if (updates[value] && typeof updates[value] === 'object' && !Array.isArray(updates[value])) {
                Object.keys(updates[value]).forEach(subValue => {
                    ret.push(alias + '."' + value + subValue[0].toUpperCase() + subValue.substr(1).toLowerCase() + '"');
                });
            } else {
                ret.push(alias + '."' + value + '"');
            }
        });
        return ret;
    }

    /**
     * Insert an entry in the log. The log ist just another entity in the database.
     * You can only use this in a transaction. So you have to pass an entity manager.
     * @param em
     * @param target
     * @param alias
     * @param updates
     * @param userId
     * @param action
     */
    static async log (em: EntityManager, target: ObjectType<any>, alias: string, updates: any, userId: number, action: Actions = Actions.UPDATE) {
        const oldValues = await em.getRepository(target).createQueryBuilder(alias)
            .select(this.buildSelect(updates, alias))
            .where('id = :id', { id: updates.id })
            .getRawOne().then(value => {
                if (value === undefined) {
                    throw new UserInputError('Id not found');
                }
                return value;
            }); // use getRawOne to also get ids of related entities

        Object.keys(oldValues).forEach(value => {
            if (value.match(alias + '_')) {
                oldValues[value.replace(alias + '_', '')] = oldValues[value];
                delete oldValues[value];
            }
        });
        // TODO: check if new values are different from old note: the commented section will probably fail for nested objects.
        /*
               const newValues = { ...updates }; // copy updates to mimic call by value
               Object.keys(updates).forEach((key, i) => {
                   // eslint-disable-next-line eqeqeq
                   if (newValues[key] == oldValues[key]) {
                       delete newValues[key];
                       delete oldValues[key];
                   }
               });
                */
        const logEntry : ActionLog = {
            userId: userId,
            entity: target.name,
            action: action,
            entriesOld: JSON.stringify(oldValues),
            entriesNew: JSON.stringify(updates)
        };
        await em.getRepository(ActionLog)
            .createQueryBuilder('al')
            .insert()
            .values([logEntry])
            .execute();
    }
}
