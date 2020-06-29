/**
 * Background worker - download, parse and store tide info of given event (locationCode, year)
 */
import { Handler, Context } from 'aws-lambda';
import Log from '@dazn/lambda-powertools-logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
export const handler: Handler = async (event: any, context: Context) => {
  Log.info('Going to download tide info', { locationCode: 'TODO', year: 1234 });
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
};
