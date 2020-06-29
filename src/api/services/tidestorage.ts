import { DynamoDB } from 'aws-sdk';
import Log from '@dazn/lambda-powertools-logger';

import { TideInfo } from '@lib/common';

const TIDE_INFO_TABLE_NAME = 'TideInfo';
const TIDE_INFO_TABLE_PK_NAME = 'locationCodeYear';

interface StoredTideInfoRecord {
  locationCodeYear: string;
  // JSON serialized TideInfo object
  tideInfoJson: string;
  /**
   * As received from backend system so we do not need to
   * re-download it when we need to make changes to the JSON
   */
  tideInfoRaw: string;
}

export class TideStorage {
  constructor(private docClient: DynamoDB.DocumentClient) {}

  /**
   * Retrieve TideInfo for the given location and the given year.
   * @returns undefined when no data found in backend storage
   */
  public async getTideInfo(locationCode: string, year: number): Promise<TideInfo | undefined> {
    try {
      const record = await this.docClient
        .get({
          TableName: TIDE_INFO_TABLE_NAME,
          Key: {
            [TIDE_INFO_TABLE_PK_NAME]: formatPrimaryKey(locationCode, year),
          },
        })
        .promise();

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property
      // If there is no matching item, GetItem does not return any data and there will be no Item element in the response.
      if (!record.Item) {
        return undefined; // no data found
      }

      // go from untyped back to typed land, huray!
      return JSON.parse((record.Item as StoredTideInfoRecord).tideInfoJson, dateReviver) as TideInfo;
    } catch (err) {
      Log.error(
        'Error raised while retrieving tide info from datastore, returning undefined response',
        { locationCode, year },
        err,
      );
      return undefined;
    }
  }

  public async putTideInfo(locationCode: string, year: number, info: TideInfo) {
    // TODO: implement
  }
}

function formatPrimaryKey(locationCode: string, year: number) {
  return `${locationCode}_${year}`;
}

/**
 * pattern matches ISO date strings 2020-06-29T23:41:03.744Z
 */
const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/;
/**
 * JSON.parse reviver for ISO formatted date strings
 * @param key string
 * @param value any
 */
function dateReviver(key, value) {
  if (typeof value === 'string') {
    if (isoDatePattern.exec(value)) {
      return new Date(value);
    }
  }
  return value;
}
