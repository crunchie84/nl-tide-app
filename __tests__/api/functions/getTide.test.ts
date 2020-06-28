import { handler, getTideHandlerEvent } from '../../../src/api/functions/getTide/getTide.handler';
import { Context } from 'aws-lambda';

describe('[GET] /api/tide', () => {
  const emptyCallback = () => {
    /* no-op */
  };

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
