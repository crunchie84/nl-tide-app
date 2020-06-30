/**
 * return tide info for given location
 */
import { Handler, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import Log from '@dazn/lambda-powertools-logger';

import { TideLocations, TideInfo, Location } from '@lib/common';

import { TideStorage } from '../../services/tidestorage';
import { createResponseObject } from '@api/helpers/response';
import { queueDownloadOfTideInfo } from '@api/helpers/queue';

export interface getTideHandlerEvent {
  pathParameters: {
    locationcode: string;
    date: string;
  };
}

interface TideDateResponse extends TideInfo {
  location: Location;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler: Handler = async (event: getTideHandlerEvent, context: Context) => {
  const locationCode = event.pathParameters.locationcode;
  const location = TideLocations.find((location) => location.code === locationCode);
  if (location === undefined) {
    return locationNotFoundResponse(locationCode);
  }

  // parse date (quick & dirty for now)
  const date = parseDateStr(event.pathParameters.date);
  if (date === undefined) {
    return invalidDateResponse();
  }

  const docClient = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
  const storage = new TideStorage(docClient);

  const tideInfo = await storage.getTideInfo(location.code, date.getFullYear());
  if (!tideInfo) {
    await queueDownloadOfTideInfo(location.code, date.getFullYear());
    return locationTideInfoQueuedForDownloadResponse(location.code, date.getFullYear());
  }

  const requestedDate = date.toISOString().substr(0, 10);
  return tideInfoResponse({
    location,
    elevationReferencePoint: tideInfo.elevationReferencePoint,
    tides: tideInfo.tides.filter((tide) => tide.at.toISOString().substr(0, 10) === requestedDate),
  });
};

function tideInfoResponse(data: TideDateResponse) {
  Log.debug('Returning tide info for location', { locationCode: data.location.code });
  return createResponseObject(200, data);
}

/**
 * response when the tide info is not yet present in our API
 */
function locationTideInfoQueuedForDownloadResponse(locationCode, year) {
  Log.debug('Queued download of tide info for location', { locationCode, year });
  return createResponseObject(201, {});
}

function locationNotFoundResponse(locationCode) {
  Log.debug('Location not found', { locationCode });
  return createResponseObject(404, {});
}

function invalidDateResponse() {
  return createResponseObject(400, { message: 'Date did not represent a valid date. Format yyyy-mm-dd' });
}

function parseDateStr(date: string): Date | undefined {
  const ms = Date.parse(date + 'T00:00:00Z');
  if (!isNaN(ms)) {
    return new Date(ms);
  }
  return undefined;
}
