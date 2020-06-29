/**
 * Background worker - download, parse and store tide info of given event (locationCode, year)
 */
import { Handler, Context } from 'aws-lambda';
import Log from '@dazn/lambda-powertools-logger';
import { downloadTideSourceInfo, parseXml, mapXmlToJson } from '../../services/crawler';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
export const handler: Handler = async (event: any, context: Context) => {
  const locationCode = '';//TODO
  const year = 2020; //TODO
  Log.info('Going to download tide info', { locationCode, year });

  try {
    const raw = await downloadTideSourceInfo(locationCode, year);
    const parsed = await parseXml(raw.data);
    const mapped = await mapXmlToJson(parsed);
    Log.debug('tide info result: ' + JSON.stringify(mapped));
  }
  catch (err) {
    Log.error('Error while downloading and mapping tide info', { locationCode, year }, err);
    return { statusCode: 500 };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
};
