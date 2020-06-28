import { DynamoDB } from 'aws-sdk';
import { TideInfo } from '../../lib/common';

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
      const data = await this.docClient
        .get({
          TableName: TIDE_INFO_TABLE_NAME,
          Key: {
            [TIDE_INFO_TABLE_PK_NAME]: formatPrimaryKey(locationCode, year),
          },
        })
        .promise()
        .then((result) => {
          // go from untyped back to typed land, huray!
          return JSON.parse((result.Item as StoredTideInfoRecord).tideInfoJson) as TideInfo;
        });
      return data;
    } catch (err) {
      //Log.error('could not fetch data', err);
    }
    return undefined;
  }
}

function formatPrimaryKey(locationCode: string, year: number){
  return `${locationCode}_${year}`;
}
