import Log from '@dazn/lambda-powertools-logger';
import * as sinon from 'sinon';

import { handler } from '@api/functions/getLocations/getLocations.handler';
import { Context } from 'aws-lambda';

describe('[GET] /api/location', () => {
  const emptyCallback = () => {
    /* no-op */
  };

  let sandbox: sinon.SinonSandbox;
  beforeAll(() => {
    sandbox = sinon.createSandbox();
  });
  beforeEach(() => {
    sandbox.stub(Log, 'error');
    sandbox.stub(Log, 'debug');
    sandbox.stub(Log, 'info');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Returns location array', async () => {
    const codeOfLocation = 'ROTTDM-Rotterdam';
    const nameOfLocation = 'Rotterdam';

    //act
    const result = await handler({}, {} as Context, emptyCallback);

    //assert
    expect(result.statusCode).toEqual(200);
    const data = JSON.parse(result.body);
    expect(data).toBeDefined();
    expect(data.locations).toBeDefined();

    // { code: 'ROTTDM-Rotterdam', name: 'Rotterdam' },
    const item = data.locations.find((i) => i.code === codeOfLocation);
    expect(item).toBeDefined();
    expect(item.name).toEqual(nameOfLocation);
  });
});
