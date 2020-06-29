import Log from '@dazn/lambda-powertools-logger';
import * as sinon from 'sinon';

import { handler, getTideHandlerEvent } from '@api/functions/getTide/getTide.handler';
import { Context } from 'aws-lambda';

describe('[GET] /api/tide', () => {
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

  it('Returns 404 for not existing location', async () => {
    const codeOfLocation = 'DOES_NOT_EXIST_IN_DATASET';
    const reqEvent: getTideHandlerEvent = {
      pathParameters: {
        locationcode: codeOfLocation,
        date: '2020-01-01',
      },
    };

    //act
    const result = await handler(reqEvent, {} as Context, emptyCallback);

    //assert
    expect(result.statusCode).toEqual(404);
  });
});
