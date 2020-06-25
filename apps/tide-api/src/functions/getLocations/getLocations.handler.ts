/**
 * return list of all locations - hardcoded for now
 */
import { Handler, Context } from 'aws-lambda';
import { TideLocations } from '@nl-tide-app/common'

export const handler: Handler = async (event: any, context: Context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ locations: TideLocations })
  };
};
