import { handler } from '../../../src/api/functions/getLocations/getLocations.handler';
import { Context } from 'aws-lambda';

describe('[GET] /api/location', () => {
  const emptyCallback = () => {
    /* no-op */
  };

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
