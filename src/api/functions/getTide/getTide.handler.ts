/**
 * return tide info for given location
 */
import { Handler, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import { TideLocations, TideInfo, Location } from '../../../lib/common';

import { TideStorage } from '../../services/tidestorage';

export interface getTideHandlerEvent {
  pathParameters: {
    locationcode: string;
    date: string;
  };
}

interface TideDateResponse extends TideInfo {
  location: Location;
}

export const handler: Handler = async (event: getTideHandlerEvent, context: Context) => {
  //TODO: Can we expect the pathparameters to be passed due to apigateway?
  const location = TideLocations.find((location) => location.code === event.pathParameters.locationcode);
  if (location === undefined) {
    return locationNotFoundResponse();
  }

  // parse date
  //event.pathParameters.date
  const year = 2020; // TODO - get from date

  const docClient = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
  const storage = new TideStorage(docClient);

  const tideInfo = await storage.getTideInfo(location.code, year);
  if (!tideInfo) {
    // invoke background process to start downloading it
    return locationTideInfoQueuedForDownloadResponse();
  }

  return tideInfoResponse({
    location,
    ...tideInfo,
  });
};

function tideInfoResponse(data: TideDateResponse) {
  return createResponseObject(200, data);
}

/**
 * response when the tide info is not yet present in our API
 */
function locationTideInfoQueuedForDownloadResponse() {
  return createResponseObject(201, {});
}

function locationNotFoundResponse() {
  return createResponseObject(404, {});
}

function createResponseObject(statusCode: number, data) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
}
