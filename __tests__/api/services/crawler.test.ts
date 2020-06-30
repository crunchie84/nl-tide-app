import * as sinon from 'sinon';
import axios from 'axios';
import Log from '@dazn/lambda-powertools-logger';

import { downloadTideSourceInfo } from '@api/services/crawler';

describe('Crawler', () => {
  let sandbox: sinon.SinonSandbox;

  beforeAll(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    sandbox.stub(Log, 'debug');
    sandbox.stub(Log, 'info');
    sandbox.stub(Log, 'error');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('downloadTideSourceInfo()', () => {
    xit('returns body from external source when http get succeeds', async () => {
      const locationCode = 'LOCCODE';
      const year = 2020;
      const expectedResponseBody = 'The quick brown fox jumps over the lazy dog';
      sandbox.stub(axios, 'get').callsFake((uri) => {
        expect(uri).toContain(locationCode);
        expect(uri).toContain(year);
        return Promise.resolve({
          data: expectedResponseBody,
          status: 200,
          headers: {},
        });
      });

      const result = await downloadTideSourceInfo(locationCode, year);
      expect(result).toEqual(expectedResponseBody);

      expect.assertions(3); // async assertions executed
    });

    it('throws error when download fails', async () => {});
  });

  xdescribe('parseXml()', () => {
    it('parses xml to json structure', async () => {});
  });

  xdescribe('mapXmlToJson()', () => {
    it('maps json structure to typed objects', async () => {});
  });
});
