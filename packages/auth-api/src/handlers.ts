import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  InitiateAuthCommand,
  AdminGetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

// Import types from shared package (relative import)
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: any;
  tokens?: any;
  error?: string;
}

interface InviteUserRequest {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface UserInvitation {
  id: string;
  email: string;
  role: string;
  tenantId: string;
  invitedBy: string;
  invitationToken: string;
  expiresAt: string;
  status: string;
  createdAt: string;
}

const cognito = new CognitoIdentityProviderClient({});
const dynamodb = new DynamoDBClient({});

const USER_POOL_ID = process.env.USER_POOL_ID!;
const CLIENT_ID = process.env.CLIENT_ID!;
const INVITATIONS_TABLE = process.env.INVITATIONS_TABLE!;

// Login handler
export async function loginHandler(event: any): Promise<any> {
  try {
    const request: LoginRequest = JSON.parse(event.body);
    
    const response = await cognito.send(new InitiateAuthCommand({
      AuthFlow: 'USER_SRP_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: request.email,
        PASSWORD: request.password,
      },
    }));

    if (response.AuthenticationResult) {
      // Get user details
      const userResponse = await cognito.send(new AdminGetUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: request.email,
      }));

      const loginResponse: LoginResponse = {
        success: true,
        user: {
          id: userResponse.Username!,
          email: request.email,
          firstName: getUserAttribute(userResponse.UserAttributes, 'given_name'),
          lastName: getUserAttribute(userResponse.UserAttributes, 'family_name'),
          role: getUserAttribute(userResponse.UserAttributes, 'custom:role') || 'employee',
          tenantId: 'co2software', // For now, single tenant
          status: 'active',
          createdAt: userResponse.UserCreateDate?.toISOString() || new Date().toISOString(),
        },
        tokens: {
          accessToken: response.AuthenticationResult.AccessToken!,
          refreshToken: response.AuthenticationResult.RefreshToken!,
          idToken: response.AuthenticationResult.IdToken!,
          expiresIn: response.AuthenticationResult.ExpiresIn!,
        },
      };

      return {
        statusCode: 200,
        body: JSON.stringify(loginResponse),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, error: 'Invalid credentials' }),
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: 'Login failed' }),
    };
  }
}

// Invite user handler
export async function inviteUserHandler(event: any): Promise<any> {
  try {
    const request: InviteUserRequest = JSON.parse(event.body);
    
    // Create invitation record
    const invitation: UserInvitation = {
      id: uuidv4(),
      email: request.email,
      role: request.role,
      tenantId: 'co2software',
      invitedBy: 'admin', // TODO: Get from JWT token
      invitationToken: uuidv4(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Save invitation to DynamoDB
    await dynamodb.send(new PutItemCommand({
      TableName: INVITATIONS_TABLE,
      Item: {
        invitationToken: { S: invitation.invitationToken },
        id: { S: invitation.id },
        email: { S: invitation.email },
        role: { S: invitation.role },
        tenantId: { S: invitation.tenantId },
        invitedBy: { S: invitation.invitedBy },
        expiresAt: { S: invitation.expiresAt },
        status: { S: invitation.status },
        createdAt: { S: invitation.createdAt },
      },
    }));

    // Create user in Cognito (disabled state)
    await cognito.send(new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: request.email,
      UserAttributes: [
        { Name: 'email', Value: request.email },
        { Name: 'given_name', Value: request.firstName },
        { Name: 'family_name', Value: request.lastName },
        { Name: 'custom:role', Value: request.role },
        { Name: 'custom:tenant_id', Value: 'co2software' },
      ],
      MessageAction: 'SUPPRESS', // Don't send welcome email
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        invitation: {
          ...invitation,
          invitationUrl: `http://localhost:3000/accept-invitation?token=${invitation.invitationToken}`,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Invite user error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: 'Failed to invite user' }),
    };
  }
}

// Accept invitation handler
export async function acceptInvitationHandler(event: any): Promise<any> {
  try {
    const { invitationToken, password } = JSON.parse(event.body);
    
    // Get invitation from DynamoDB
    const invitationResponse = await dynamodb.send(new GetItemCommand({
      TableName: INVITATIONS_TABLE,
      Key: {
        invitationToken: { S: invitationToken },
      },
    }));

    if (!invitationResponse.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: 'Invalid invitation' }),
      };
    }

    if (!invitationResponse.Item?.email?.S) {
      throw new Error('Invalid invitation: email not found');
    }
    const email = invitationResponse.Item.email.S;

    // Set user password in Cognito
    await cognito.send(new AdminSetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: true,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Invitation accepted' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Accept invitation error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: 'Failed to accept invitation' }),
    };
  }
}

// Helper function
function getUserAttribute(attributes: any[] | undefined, name: string): string {
  if (!attributes) return '';
  const attr = attributes.find(a => a.Name === name);
  return attr?.Value || '';
}

// Simple payroll calculation endpoint for testing
export async function calculatePayrollHandler(event: any): Promise<any> {
  try {
    const { hours, rate } = JSON.parse(event.body);
    
    const grossPay = hours * rate;
    const tax = grossPay * 0.2; // 20% tax
    const netPay = grossPay - tax;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        hours,
        rate,
        grossPay,
        tax,
        netPay,
        calculation: `${hours} hours × $${rate}/hour = $${grossPay} gross, $${tax} tax (20%), $${netPay} net`
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request' }),
    };
  }
}
