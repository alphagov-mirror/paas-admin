import moment from 'moment';
import nock from 'nock';
import pino from 'pino';

import PromClient from '.';

const config = {
  apiEndpoint: 'https://example.com/prom',
  username: 'jeff',
  password: 'J3ff3rs0n!',
  logger: pino({ level: 'silent' }),
};

describe('lib/prom test suite', () => {
  let nockPrometheus: nock.Scope;

  beforeEach(() => {
    nock.cleanAll();

    nockPrometheus = nock(config.apiEndpoint);
  });

  afterEach(() => {
    nockPrometheus.done();

    nock.cleanAll();
  });

  it('should throw error when prometheus responds with 404', async () => {
    nockPrometheus.get(/api.v1.query\??/).reply(404, { error: 'not found' });

    const client = new PromClient(
      config.apiEndpoint,
      config.username,
      config.password,
      config.logger,
    );
    await expect(
      client.getValue('http_response_2xx', new Date()),
    ).rejects.toThrowError(/failed with status 404/);
  });

  it('should throw error when prometheus responds with 404 no body', async () => {
    nockPrometheus.get(/api.v1.query\??/).reply(404);

    const client = new PromClient(
      config.apiEndpoint,
      config.username,
      config.password,
      config.logger,
    );
    await expect(
      client.getValue('http_response_2xx', new Date()),
    ).rejects.toThrowError(/failed with status 404/);
  });

  it('should getValue successfully', async () => {
    nockPrometheus.get(/api.v1.query\??/).reply(200, {
      status: 'success',
      data: {
        result: [
          {
            value: [
              moment()
                .toDate()
                .getTime() / 1000,
              `${Math.random() * 100}`,
            ],
          },
        ],
      },
    });

    const client = new PromClient(
      config.apiEndpoint,
      config.username,
      config.password,
      config.logger,
    );
    const values = await client.getValue('http_response_2xx', new Date());

    expect(values).toBeDefined();
    expect(values!.length).toBeGreaterThan(0);
    expect(values![0]).toBeGreaterThan(0);
  });

  it('should fail to getValue when invalid query has been provided', async () => {
    nockPrometheus.get(/api.v1.query\??/).reply(200, {
      status: 'success',
      data: { result: [] },
    });

    const client = new PromClient(
      config.apiEndpoint,
      config.username,
      config.password,
      config.logger,
    );
    const value = await client.getValue('http_response_5xx', new Date());

    expect(value).toBeUndefined();
  });

  it('should getSeries successfully', async () => {
    nockPrometheus.get(/api.v1.query_range\??/).reply(200, {
      status: 'success',
      data: {
        result: [
          {
            metric: {
              instance: '001',
            },
            values: [
              [
                moment()
                  .toDate()
                  .getTime() / 1000,
                `${Math.random() * 100}`,
              ],
              [
                moment()
                  .toDate()
                  .getTime() / 1000,
                `${Math.random() * 100}`,
              ],
              [
                moment()
                  .toDate()
                  .getTime() / 1000,
                `${Math.random() * 100}`,
              ],
              [
                moment()
                  .toDate()
                  .getTime() / 1000,
                `${Math.random() * 100}`,
              ],
            ],
          },
          {
            metric: {
              instance: '002',
            },
            values: [
              [
                moment()
                  .toDate()
                  .getTime() / 1000,
                `${Math.random() * 100}`,
              ],
              [
                moment()
                  .toDate()
                  .getTime() / 1000,
                `${Math.random() * 100}`,
              ],
              [
                moment()
                  .toDate()
                  .getTime() / 1000,
                `${Math.random() * 100}`,
              ],
              [
                moment()
                  .toDate()
                  .getTime() / 1000,
                `${Math.random() * 100}`,
              ],
            ],
          },
        ],
      },
    });

    const client = new PromClient(
      config.apiEndpoint,
      config.username,
      config.password,
      config.logger,
    );
    const series = await client.getSeries(
      'http_response_2xx',
      10,
      moment()
        .subtract(1, 'day')
        .toDate(),
      moment().toDate(),
    );

    expect(series).toBeDefined();
    expect(series!.length).toEqual(2);
    expect(series![0].metrics.length).toEqual(4);
  });

  it('should fail to getSeries when invalid query has been provided', async () => {
    nockPrometheus.get(/api.v1.query_range\??/).reply(200, {
      status: 'success',
      data: {
        result: [],
      },
    });

    const client = new PromClient(
      config.apiEndpoint,
      config.username,
      config.password,
      config.logger,
    );
    const series = await client.getSeries(
      'http_response_5xx',
      10,
      moment()
        .subtract(1, 'day')
        .toDate(),
      moment().toDate(),
    );

    expect(series).toBeUndefined();
  });
});
