/**
 * return tide info for given location
 */
import { Handler, Context } from 'aws-lambda';
import { TideLocations, TideInfo } from '../../../lib/common';

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

  // go and find if we have location tide info available. Invoke background process to gather & cache it
  // or return it from our datasource

  return {
    statusCode: 501,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
};

/**
 * response when the tide info is not yet present in our API
 */
function locationTideInfoQueuedForDownload() {
  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
}

function locationNotFoundResponse() {
  return {
    statusCode: 404,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
}
