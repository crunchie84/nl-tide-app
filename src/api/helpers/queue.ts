import Log from '@dazn/lambda-powertools-logger';
import { Lambda } from 'aws-sdk';
import { DownloadTideInfoEvent } from '@api/types/downloadTideInfoEvent';

export async function queueDownloadOfTideInfo(locationCode: string, year: number): Promise<undefined> {
  const event: DownloadTideInfoEvent = {
    locationCode,
    year,
    created: new Date().toISOString(),
  };
  Log.info('Queueing download of tideinfo in background', event);

  /**
   * TODO - this implementation should be swapped out for SNS instead
   * because this is hard-coding linking lambdas together.
   *
   * It merely serves as an example that this is actually possible
   * albeit ugly/wrong
   *
   * https://github.com/crunchie84/nl-tide-app/issues/29
   */
  const lambda = new Lambda({
    region: 'eu-central-1',
  });

  await lambda
    .invoke({
      FunctionName: 'tide-api-dev-queueWorkerDownloadTideInfo',
      InvocationType: 'Event',
      Payload: JSON.stringify(event, null, 2),
    })
    .promise();
  return;
}
