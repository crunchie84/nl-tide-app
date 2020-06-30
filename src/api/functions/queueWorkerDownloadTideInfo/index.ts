/**
 * Background worker - download, parse and store tide info of given event (locationCode, year)
 */
import { Handler, Context } from 'aws-lambda';
import Log from '@dazn/lambda-powertools-logger';
import { downloadTideSourceInfo, parseXml, mapXmlToJson } from '../../services/crawler';
import { TideStorage } from '@api/services/tidestorage';
import { DynamoDB } from 'aws-sdk';
import { createResponseObject } from '@api/helpers/response';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
export const handler: Handler = async (event: any, context: Context) => {
  const locationCode = 'ROTTDM-Rotterdam'; //TODO
  const year = 2020; //TODO
  try {
    const raw = await downloadTideSourceInfo(locationCode, year);
    const parsed = await parseXml(raw);
    const mapped = await mapXmlToJson(parsed);

    const docClient = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
    const storage = new TideStorage(docClient);
    await storage.putTideInfo(locationCode, year, mapped);

    return createResponseObject(200, { locationCode, year });
  } catch (err) {
    Log.error('Error while downloading and mapping tide info', { locationCode, year }, err);
    return createResponseObject(500, { message: err.message });
  }
};
