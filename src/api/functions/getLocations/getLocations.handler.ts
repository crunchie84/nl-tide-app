/**
 * return list of all locations - hardcoded for now
 */
import { Handler, Context } from 'aws-lambda';
import Log from '@dazn/lambda-powertools-logger';

import { TideLocations } from '@lib/common';
import { createResponseObject } from '@api/helpers/response';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
export const handler: Handler = async (event: any, context: Context) => {
  Log.info('Returning locations');
  return createResponseObject(200, { locations: TideLocations });
};
