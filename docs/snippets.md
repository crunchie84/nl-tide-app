# invoke background lambda using event

https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html

https://stackoverflow.com/questions/31714788/can-an-aws-lambda-function-call-another

```
var aws = require('aws-sdk');
var lambda = new aws.Lambda({
  region: 'us-west-2' //change to your region
});

lambda.invoke({
  FunctionName: 'name_of_your_lambda_function',
  InvocationType: "Event",
  Payload: JSON.stringify(event, null, 2) // pass params
}, function(error, data) {
  if (error) {
    context.done('error', error);
  }
  if(data.Payload){
   context.succeed(data.Payload)
  }
});
```

Note that the calling lambda function's role needs to include IAM policy AWSLambdaRole. Or, you can add the following statement object to your role's existing policy: '{ "Effect": "Allow", "Action": [ "lambda:InvokeFunction" ], "Resource": ["*"] }`


# commands

sls deploy --config src/api/serverless.yml --aws-profile marks-playground
sls invoke local --function getLocations --config src/api/serverless.yml
npm run lint
npm test
