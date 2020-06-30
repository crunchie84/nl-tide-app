export interface AwsLambdaResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

/**
 * generate aws lambda response object
 *
 * @param statusCode
 * @param data
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function createResponseObject(statusCode: number, data: any): AwsLambdaResponse {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
}
