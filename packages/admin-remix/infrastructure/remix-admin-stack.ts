import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class RemixAdminStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function for Remix app
    const remixFunction = new lambda.Function(this, 'RemixAdminFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../lambda'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      environment: {
        NODE_ENV: 'production',
        USER_POOL_ID: 'eu-west-2_fIYX1VxbP',
        CLIENT_ID: '3ln01ije3h2hlgk3ul2tcgrq0d',
        AWS_REGION: 'eu-west-2',
        SESSION_SECRET: 'co2software-remix-secret-change-in-production'
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
    });

    // API Gateway
    const api = new apigateway.LambdaRestApi(this, 'RemixAdminApi', {
      handler: remixFunction,
      proxy: true,
      binaryMediaTypes: ['*/*'],
      deployOptions: {
        stageName: 'prod',
        throttlingBurstLimit: 100,
        throttlingRateLimit: 50,
      },
    });

    // Outputs
    new cdk.CfnOutput(this, 'AdminPanelUrl', {
      value: api.url,
      description: 'Remix Admin Panel URL',
    });

    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: remixFunction.functionName,
      description: 'Lambda Function Name',
    });
  }
}
