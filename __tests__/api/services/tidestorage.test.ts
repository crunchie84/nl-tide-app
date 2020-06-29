import { DynamoDB } from 'aws-sdk';

import * as sinon from 'sinon';

import { TideStorage } from '../../../src/api/services/tidestorage';
import { TideInfo } from '../../../src/lib/common';

describe('TideStorage()', () => {
  let sandbox: sinon.SinonSandbox;

  beforeAll(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const stubTideInfo: TideInfo = {
    elevationReferencePoint: 'MLS',
    tides: [
      { at: new Date('2020-06-29T01:41:03.744Z'), tide: 'LW', elevation: -5 },
      { at: new Date('2020-06-29T13:41:03.744Z'), tide: 'HW', elevation: 25 },
      { at: new Date('2020-06-29T19:41:03.744Z'), tide: 'LW', elevation: -8 },
      { at: new Date('2020-06-29T23:41:03.744Z'), tide: 'HW', elevation: 39 },
    ],
  };

  const locationCode = 'STUBLOCATION';
  const year = 2020;

  it('Returns TideInfo for stored object', async () => {
    // arrange
    const stubDocClient = createStubDocClient(
      sandbox,
      Promise.resolve({
        Item: {
          locationCodeYear: locationCode + '_' + year,
          tideInfoJson: JSON.stringify(stubTideInfo),
        },
      }),
    );
    const storage = new TideStorage(stubDocClient);
    const result = await storage.getTideInfo(locationCode, year);

    // assert
    expect(result).toBeDefined();
    expect(result).toEqual(stubTideInfo);
  });

  it('Returns undefind for location not cached in storage', async () => {
    const stubDocClient = createStubDocClient(
      sandbox,
      Promise.resolve({
        /* no Item property because no data found */
      }),
    );

    const storage = new TideStorage(stubDocClient);
    const result = await storage.getTideInfo(locationCode, year);

    expect(result).toBeUndefined(); //no data available
  });

  it('Returns undefined when backing storage throws error', async () => {
    const stubDocClient = createStubDocClient(sandbox, Promise.reject(new Error('SPLUT from test')));
    const storage = new TideStorage(stubDocClient);

    const result = await storage.getTideInfo(locationCode, year);

    expect(result).toBeUndefined(); // backend has thrown, storage has eaten it. we should get error
  });
});

function createStubDocClient<T>(sandbox: sinon.SinonSandbox, getItemResponse: Promise<T>) {
  const stubDocClient = {} as DynamoDB.DocumentClient;
  stubDocClient.get = sandbox.stub().returns({
    // eslint-disable-next-line prettier/prettier
    promise: () => getItemResponse,
  });
  return stubDocClient;
}
