/**
 * Background worker - download, parse and store tide info of given event (locationCode, year)
 */
import { Handler, Context } from 'aws-lambda';
import Log from '@dazn/lambda-powertools-logger';
import { downloadTideSourceInfo, parseXml, mapXmlToJson } from '../../services/crawler';
import { TideStorage } from '@api/services/tidestorage';
import { DynamoDB } from 'aws-sdk';
import { createResponseObject } from '@api/helpers/response';
import { DownloadTideInfoEvent } from '@api/types/downloadTideInfoEvent';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
export const handler: Handler = async (event: DownloadTideInfoEvent, context: Context) => {
  Log.debug('Going to download & store tide info', event);
  try {
    const raw = await downloadTideSourceInfo(event.locationCode, event.year);
    const parsed = await parseXml(raw);
    const mapped = await mapXmlToJson(parsed);

    const docClient = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
    const storage = new TideStorage(docClient);
    await storage.putTideInfo(event.locationCode, event.year, mapped);

    Log.info('Stored new tide info', { locationCode: event.locationCode, year: event.year });
    return createResponseObject(200, { locationCode: event.locationCode, year: event.year });
  } catch (err) {
    Log.error('Error while downloading and mapping tide info', event, err);
    return createResponseObject(500, { message: err.message });
  }
};
