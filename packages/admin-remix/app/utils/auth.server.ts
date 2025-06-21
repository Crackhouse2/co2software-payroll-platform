import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import bcrypt from "bcryptjs";

const cognitoClient = new CognitoIdentityProviderClient({ 
  region: process.env.AWS_REGION || "eu-west-2" 
});

const USER_POOL_ID = process.env.USER_POOL_ID || "eu-west-2_fIYX1VxbP";
const CLIENT_ID = process.env.CLIENT_ID || "3ln01ije3h2hlgk3ul2tcgrq0d";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export async function authenticateUser(
  email: string, 
  password: string
): Promise<User | null> {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await cognitoClient.send(command);
    
    if (response.AuthenticationResult?.AccessToken) {
      // Extract user info from tokens or make additional call
      return {
        id: email, // Use email as ID for now
        email,
        role: "admin", // Extract from token claims in production
        firstName: "Admin",
        lastName: "User"
      };
    }
    
    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  // In production, fetch from DynamoDB user table
  return {
    id,
    email: id,
    role: "admin",
    firstName: "Admin",
    lastName: "User"
  };
}
