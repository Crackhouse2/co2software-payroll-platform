#!/bin/bash

# Deploy co2software Payroll to AWS (Free Tier)
# File: deploy-to-aws.sh
# Command: ./deploy-to-aws.sh

set -e

echo "🚀 Deploying co2software Payroll to AWS (FREE TIER)..."

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install: https://aws.amazon.com/cli/"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Run: aws configure"
    exit 1
fi

echo "✅ AWS credentials configured"
echo "🎯 Account: $(aws sts get-caller-identity --query Account --output text)"
echo "🌍 Region: $(aws configure get region)"

# Install dependencies
echo "📦 Installing CDK dependencies..."
cd packages/auth-infrastructure
npm install

# Bootstrap CDK (if needed)
echo "🏗️ Bootstrapping CDK..."
npx cdk bootstrap || echo "CDK already bootstrapped"

# Deploy the stack
echo "🚀 Deploying authentication stack..."
npx cdk deploy --require-approval never

# Get outputs
echo "📋 Getting deployment outputs..."
API_URL=$(aws cloudformation describe-stacks --stack-name Co2SoftwarePayrollAuth --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' --output text)
USER_POOL_ID=$(aws cloudformation describe-stacks --stack-name Co2SoftwarePayrollAuth --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' --output text)
CLIENT_ID=$(aws cloudformation describe-stacks --stack-name Co2SoftwarePayrollAuth --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' --output text)

# Update admin UI configuration automatically
echo "🔧 Updating admin UI configuration..."
cd ../../packages/admin-ui/src

# Update config.js with deployed API URL
cat > config.js << CONFIG_EOF
// Configuration for co2software Payroll Admin UI
window.AppConfig = {
  // API Configuration - Updated by deployment
  API_BASE_URL: '${API_URL}',
  
  // App Configuration
  APP_NAME: 'co2software Payroll',
  VERSION: '1.0.0',
  
  // Default Admin Credentials (for demo)
  DEFAULT_ADMIN_EMAIL: 'admin@co2software.co.uk',
  
  // AWS Configuration
  USER_POOL_ID: '${USER_POOL_ID}',
  CLIENT_ID: '${CLIENT_ID}',
  AWS_REGION: '$(aws configure get region)',
  
  // Feature Flags
  FEATURES: {
    SHOW_API_TEST_TAB: true,
    SHOW_DEPLOYMENT_INSTRUCTIONS: false,
    AUTO_DETECT_API: false
  }
};

// Set deployed API URL globally
window.DEPLOYED_API_URL = '${API_URL}';

console.log('🚀 Admin UI configured for deployment:', window.AppConfig);
CONFIG_EOF

# Update .env file
cat > ../.env << ENV_EOF
# co2software Payroll Admin UI Configuration - Updated by deployment
API_BASE_URL=${API_URL}
USER_POOL_ID=${USER_POOL_ID}
CLIENT_ID=${CLIENT_ID}
AWS_REGION=$(aws configure get region)
NODE_ENV=production
ENV_EOF

cd ../../../

echo ""
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo ""
echo "📊 AWS Resources Created (FREE TIER):"
echo "   ✅ Cognito User Pool: $USER_POOL_ID"
echo "   ✅ DynamoDB Table: co2software-user-invitations"
echo "   ✅ Lambda Function: Authentication handler"
echo "   ✅ API Gateway: $API_URL"
echo ""
echo "💰 Cost: $0/month (Free Tier)"
echo ""
echo "🎯 NEXT STEPS:"
echo "1. ✅ Admin UI automatically configured with API URL"
echo ""
echo "2. Create first admin user:"
echo "   aws cognito-idp admin-create-user \\"
echo "     --user-pool-id $USER_POOL_ID \\"
echo "     --username admin@co2software.co.uk \\"
echo "     --user-attributes Name=email,Value=admin@co2software.co.uk Name=given_name,Value=Admin Name=family_name,Value=User \\"
echo "     --temporary-password TempPass123! \\"
echo "     --message-action SUPPRESS"
echo ""
echo "3. Set permanent password:"
echo "   aws cognito-idp admin-set-user-password \\"
echo "     --user-pool-id $USER_POOL_ID \\"
echo "     --username admin@co2software.co.uk \\"
echo "     --password AdminPass123! \\"
echo "     --permanent"
echo ""
echo "4. Test login at http://localhost:3000"
echo "   Email: admin@co2software.co.uk"
echo "   Password: AdminPass123!"
echo ""
echo "🚀 Your payroll system is now LIVE on AWS with automatic configuration!"
