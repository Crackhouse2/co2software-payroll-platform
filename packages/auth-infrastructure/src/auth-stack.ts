import { Stack, StackProps, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  UserPool,
  UserPoolClient,
  AccountRecovery,
  Mfa
} from 'aws-cdk-lib/aws-cognito';
import {
  Table,
  AttributeType,
  BillingMode
} from 'aws-cdk-lib/aws-dynamodb';
import {
  Function,
  Runtime,
  Code
} from 'aws-cdk-lib/aws-lambda';
import {
  RestApi,
  LambdaIntegration,
  Cors
} from 'aws-cdk-lib/aws-apigateway';
import {
  PolicyStatement,
  Effect
} from 'aws-cdk-lib/aws-iam';

export class AuthStack extends Stack {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;
  public readonly invitationsTable: Table;
  public readonly api: RestApi;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Cognito User Pool for authentication
    this.userPool = new UserPool(this, 'PayrollUserPool', {
      userPoolName: 'co2software-payroll-users',
      selfSignUpEnabled: false, // Admin-only user creation
      signInAliases: {
        email: true,
        username: false,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
      },
      mfa: Mfa.OPTIONAL,
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // User Pool Client with simpler auth flows
    this.userPoolClient = new UserPoolClient(this, 'PayrollUserPoolClient', {
      userPool: this.userPool,
      userPoolClientName: 'co2software-payroll-client',
      generateSecret: false,
      authFlows: {
        userSrp: true,
        userPassword: true, // Enable ALLOW_USER_PASSWORD_AUTH
        adminUserPassword: true,
      },
    });

    // DynamoDB table for user invitations (FREE TIER)
    this.invitationsTable = new Table(this, 'UserInvitations', {
      tableName: 'co2software-user-invitations',
      partitionKey: {
        name: 'invitationToken',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.invitationsTable.addGlobalSecondaryIndex({
      indexName: 'EmailIndex',
      partitionKey: {
        name: 'email',
        type: AttributeType.STRING,
      },
      readCapacity: 5,
      writeCapacity: 5,
    });

    // Lambda function with better error handling
    const authHandler = new Function(this, 'AuthHandler', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: Code.fromInline(`
        const { 
          CognitoIdentityProviderClient,
          AdminCreateUserCommand,
          AdminSetUserPasswordCommand,
          InitiateAuthCommand,
          AdminGetUserCommand,
          AdminInitiateAuthCommand,
        } = require('@aws-sdk/client-cognito-identity-provider');
        const { DynamoDBClient, PutItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
        const { randomUUID } = require('crypto');

        const cognito = new CognitoIdentityProviderClient({});
        const dynamodb = new DynamoDBClient({});

        exports.handler = async (event) => {
          console.log('Request event:', JSON.stringify(event, null, 2));
          
          const { httpMethod, path, body } = event;
          
          const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          };

          try {
            if (httpMethod === 'OPTIONS') {
              return { statusCode: 200, headers, body: '' };
            }

            console.log('Processing request:', httpMethod, path);

            if (path === '/login' && httpMethod === 'POST') {
              return await handleLogin(JSON.parse(body || '{}'));
            }
            
            if (path === '/invite' && httpMethod === 'POST') {
              return await handleInvite(JSON.parse(body || '{}'));
            }
            
            if (path === '/accept-invitation' && httpMethod === 'POST') {
              return await handleAcceptInvitation(JSON.parse(body || '{}'));
            }

            if (path === '/calculate-payroll' && httpMethod === 'POST') {
              return await handleCalculatePayroll(JSON.parse(body || '{}'));
            }

            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Not found', path, method: httpMethod }),
            };
          } catch (error) {
            console.error('Handler error:', error);
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({ 
                error: 'Internal server error', 
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
              }),
            };
          }
        };

        async function handleLogin(request) {
          console.log('Login request:', { email: request.email });
          
          try {
            // Try admin-initiated auth first (more reliable)
            const response = await cognito.send(new AdminInitiateAuthCommand({
              UserPoolId: process.env.USER_POOL_ID,
              ClientId: process.env.CLIENT_ID,
              AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
              AuthParameters: {
                USERNAME: request.email,
                PASSWORD: request.password,
              },
            }));

            console.log('Auth response received');

            if (response.AuthenticationResult) {
              console.log('Authentication successful, getting user details');
              
              const userResponse = await cognito.send(new AdminGetUserCommand({
                UserPoolId: process.env.USER_POOL_ID,
                Username: request.email,
              }));

              console.log('User details retrieved');

              const user = {
                id: userResponse.Username,
                email: request.email,
                firstName: getUserAttribute(userResponse.UserAttributes, 'given_name'),
                lastName: getUserAttribute(userResponse.UserAttributes, 'family_name'),
                role: getUserAttribute(userResponse.UserAttributes, 'custom:role') || 'admin',
              };

              return {
                statusCode: 200,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                  success: true,
                  user,
                  tokens: {
                    accessToken: response.AuthenticationResult.AccessToken,
                    refreshToken: response.AuthenticationResult.RefreshToken,
                    idToken: response.AuthenticationResult.IdToken,
                    expiresIn: response.AuthenticationResult.ExpiresIn,
                  },
                }),
              };
            }

            console.log('No authentication result');
            return {
              statusCode: 401,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ success: false, error: 'Authentication failed' }),
            };

          } catch (error) {
            console.error('Login error:', error);
            
            let errorMessage = 'Login failed';
            if (error.name === 'NotAuthorizedException') {
              errorMessage = 'Invalid email or password';
            } else if (error.name === 'UserNotFoundException') {
              errorMessage = 'User not found';
            } else if (error.name === 'PasswordResetRequiredException') {
              errorMessage = 'Password reset required';
            } else if (error.name === 'UserNotConfirmedException') {
              errorMessage = 'User not confirmed';
            }
            
            return {
              statusCode: 400,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ 
                success: false, 
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
              }),
            };
          }
        }

        async function handleInvite(request) {
          console.log('Invite request:', { email: request.email, role: request.role });
          
          try {
            const invitationToken = randomUUID();
            
            await dynamodb.send(new PutItemCommand({
              TableName: process.env.INVITATIONS_TABLE,
              Item: {
                invitationToken: { S: invitationToken },
                email: { S: request.email },
                role: { S: request.role },
                firstName: { S: request.firstName },
                lastName: { S: request.lastName },
                tenantId: { S: 'co2software' },
                invitedBy: { S: 'admin' },
                expiresAt: { S: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
                status: { S: 'pending' },
                createdAt: { S: new Date().toISOString() },
              },
            }));

            await cognito.send(new AdminCreateUserCommand({
              UserPoolId: process.env.USER_POOL_ID,
              Username: request.email,
              UserAttributes: [
                { Name: 'email', Value: request.email },
                { Name: 'given_name', Value: request.firstName },
                { Name: 'family_name', Value: request.lastName },
              ],
              MessageAction: 'SUPPRESS',
            }));

            return {
              statusCode: 200,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({
                success: true,
                invitation: {
                  invitationToken,
                  invitationUrl: \`https://\${process.env.API_DOMAIN || 'localhost:3000'}/accept-invitation?token=\${invitationToken}\`,
                },
              }),
            };
          } catch (error) {
            console.error('Invite error:', error);
            return {
              statusCode: 400,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ success: false, error: 'Failed to invite user: ' + error.message }),
            };
          }
        }

        async function handleAcceptInvitation(request) {
          try {
            const invitationResponse = await dynamodb.send(new GetItemCommand({
              TableName: process.env.INVITATIONS_TABLE,
              Key: { invitationToken: { S: request.invitationToken } },
            }));

            if (!invitationResponse.Item) {
              return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ success: false, error: 'Invalid invitation' }),
              };
            }

            const email = invitationResponse.Item.email.S;

            await cognito.send(new AdminSetUserPasswordCommand({
              UserPoolId: process.env.USER_POOL_ID,
              Username: email,
              Password: request.password,
              Permanent: true,
            }));

            return {
              statusCode: 200,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ success: true }),
            };
          } catch (error) {
            console.error('Accept invitation error:', error);
            return {
              statusCode: 400,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ success: false, error: 'Failed to accept invitation: ' + error.message }),
            };
          }
        }

        async function handleCalculatePayroll(request) {
          try {
            const { hours, rate } = request;
            const grossPay = hours * rate;
            const tax = grossPay * 0.2;
            const netPay = grossPay - tax;
            
            return {
              statusCode: 200,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({
                hours, rate, grossPay, tax, netPay,
                calculation: \`\${hours} hours × $\${rate}/hour = $\${grossPay} gross, $\${tax} tax (20%), $\${netPay} net\`
              }),
            };
          } catch (error) {
            console.error('Calculate payroll error:', error);
            return {
              statusCode: 400,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ error: 'Invalid request: ' + error.message }),
            };
          }
        }

        function getUserAttribute(attributes, name) {
          if (!attributes) return '';
          const attr = attributes.find(a => a.Name === name);
          return attr?.Value || '';
        }
      `),
      environment: {
        USER_POOL_ID: this.userPool.userPoolId,
        CLIENT_ID: this.userPoolClient.userPoolClientId,
        INVITATIONS_TABLE: this.invitationsTable.tableName,
        NODE_ENV: 'development', // For better error messages
      },
    });

    // Add comprehensive permissions for Lambda
    authHandler.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'cognito-idp:AdminCreateUser',
        'cognito-idp:AdminSetUserPassword',
        'cognito-idp:AdminGetUser',
        'cognito-idp:AdminInitiateAuth',
        'cognito-idp:AdminRespondToAuthChallenge',
        'cognito-idp:InitiateAuth',
      ],
      resources: [this.userPool.userPoolArn],
    }));

    this.invitationsTable.grantReadWriteData(authHandler);

    // API Gateway
    this.api = new RestApi(this, 'PayrollApi', {
      restApiName: 'co2software-payroll-api',
      description: 'co2software Payroll API - Free Tier POC',
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // API endpoints
    const integration = new LambdaIntegration(authHandler);
    this.api.root.addResource('login').addMethod('POST', integration);
    this.api.root.addResource('invite').addMethod('POST', integration);
    this.api.root.addResource('accept-invitation').addMethod('POST', integration);
    this.api.root.addResource('calculate-payroll').addMethod('POST', integration);

    // Outputs
    new CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
      description: 'Cognito User Pool ID',
    });

    new CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
    });

    new CfnOutput(this, 'ApiEndpoint', {
      value: this.api.url,
      description: 'API Gateway endpoint URL',
    });

    new CfnOutput(this, 'InvitationsTableName', {
      value: this.invitationsTable.tableName,
      description: 'User Invitations Table Name',
    });
  }
}
