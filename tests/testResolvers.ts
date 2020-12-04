/* eslint no-unused-expressions: 0 */
import * as chai from 'chai';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import { step } from 'mocha-steps';

import chaiHttp from 'chai-http';
// @ts-ignore
import * as queries from './testQueries';
import { getApp, getConnectionOptions } from '../src/app';
import { getConnection } from 'typeorm';

chai.use(chaiHttp);
const chaiLib = <any>chai;
const request = chaiLib.default.request;
// @ts-ignore
chai.request = request;

process.env.NODE_ENV = 'develop';

function getAppServer () {
    return getApp(getConnectionOptions());
}

describe('cargo bike resolver', () => {
    let agent: any = null;

    before(async () => {
        const app = await getAppServer();
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.synchronize();
        agent = chai.request.agent(app).post('/graphql').type('json');
    });

    step('creates cargo bikes', (done) => {
        agent.send({
            query: queries.CREATE_CARGO_BIKE
        }).end((err: any, res: any) => {
            debugger;
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.errors).to.be.undefined;

            done();
        });
    });

    step('returns cargo bike data', (done) => {
        agent.send({
            query: queries.GET_CARGO_BIKE
        }).end((err: any, res: any) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.errors).to.be.undefined;
            expect(res.body.data.cargoBikes).not.to.be.empty;
        });
    });

    after(async () => {
        await getConnection().dropDatabase();
    });
});
