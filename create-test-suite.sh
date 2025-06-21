#!/bin/bash

# Improved Test Runner with Auto API Detection
# File: run-tests-improved.sh
# Command: ./run-tests-improved.sh [test-type]

set -e

echo "🧪 co2software Payroll Testing Suite"
echo "======================================"

# Function to auto-detect API URL
auto_detect_api_url() {
  echo "🔍 Auto-detecting API URL from configuration..."
  
  local api_url=""
  
  # 1. Try config.js
  if [[ -f "packages/admin-ui/src/config.js" ]]; then
    api_url=$(grep -o "API_BASE_URL: '[^']*'" packages/admin-ui/src/config.js 2>/dev/null | sed "s/API_BASE_URL: '//g" | sed "s/'//g" || true)
    
    if [[ -n "$api_url" && "$api_url" != "http://localhost:3000/api" ]]; then
      echo "✅ Found API URL in config.js: $api_url"
      echo "$api_url"
      return 0
    fi
  fi
  
  # 2. Try .env file
  if [[ -f "packages/admin-ui/.env" ]]; then
    api_url=$(grep "^API_BASE_URL=" packages/admin-ui/.env 2>/dev/null | cut -d'=' -f2 || true)
    
    if [[ -n "$api_url" && "$api_url" != "http://localhost:3000/api" ]]; then
      echo "✅ Found API URL in .env file: $api_url"
      echo "$api_url"
      return 0
    fi
  fi
  
  # 3. Try AWS CloudFormation
  if command -v aws &> /dev/null; then
    api_url=$(aws cloudformation describe-stacks --stack-name Co2SoftwarePayrollAuth --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' --output text 2>/dev/null || true)
    
    if [[ -n "$api_url" && "$api_url" != "None" ]]; then
      echo "✅ Found API URL from AWS CloudFormation: $api_url"
      echo "$api_url"
      return 0
    fi
  fi
  
  # 4. Check if already set in environment
  if [[ -n "$API_BASE_URL" && "$API_BASE_URL" != "http://localhost:3000/api" ]]; then
    echo "✅ Using existing environment variable: $API_BASE_URL"
    echo "$API_BASE_URL"
    return 0
  fi
  
  return 1
}

# Auto-detect and set API URL
if API_URL=$(auto_detect_api_url); then
  export API_BASE_URL="$API_URL"
  echo "🎯 API_BASE_URL automatically set to: $API_BASE_URL"
else
  echo "⚠️ Could not auto-detect API URL"
  echo ""
  echo "🔧 Options to fix this:"
  echo "1. Deploy first: ./deploy-to-aws.sh"
  echo "2. Set manually: export API_BASE_URL=https://your-api-url.execute-api.eu-west-2.amazonaws.com/prod"
  echo "3. Check deployment: aws cloudformation describe-stacks --stack-name Co2SoftwarePayrollAuth"
  echo ""
  echo "For now, running tests that don't require API..."
fi

echo ""

# Move to testing directory
cd packages/testing

# Parse arguments
TEST_TYPE=${1:-"all"}

case $TEST_TYPE in
  "unit")
    echo "🔢 Running unit tests..."
    npm run test:unit
    ;;
    
  "integration")
    echo "🔗 Running integration tests..."
    if [[ -z "$API_BASE_URL" || "$API_BASE_URL" == "http://localhost:3000/api" ]]; then
      echo "⚠️ Skipping integration tests - API URL not detected"
      echo "Deploy your stack first: ./deploy-to-aws.sh"
    else
      echo "🎯 Using API URL: $API_BASE_URL"
      npm run test:integration
    fi
    ;;
    
  "e2e")
    echo "🎭 Running E2E tests..."
    # Install Playwright browsers if needed
    npx playwright install --with-deps chromium
    npm run test:e2e
    ;;
    
  "api")
    echo "🌐 Running API tests..."
    if [[ -z "$API_BASE_URL" || "$API_BASE_URL" == "http://localhost:3000/api" ]]; then
      echo "⚠️ Skipping API tests - API URL not detected"
      echo "Deploy your stack first: ./deploy-to-aws.sh"
    else
      echo "🎯 Testing API: $API_BASE_URL"
      npm run test:api
    fi
    ;;
    
  "coverage")
    echo "📊 Running tests with coverage..."
    npm run test:coverage
    ;;
    
  "quick")
    echo "⚡ Running quick tests (unit + E2E)..."
    
    echo "📊 Step 1: Unit tests..."
    npm run test:unit
    
    echo "🎭 Step 2: E2E tests..."
    npx playwright install --with-deps chromium
    npm run test:e2e --project=chromium
    ;;
    
  "all")
    echo "🚀 Running all tests..."
    
    echo "📊 Step 1: Unit tests..."
    npm run test:unit
    
    if [[ -n "$API_BASE_URL" && "$API_BASE_URL" != "http://localhost:3000/api" ]]; then
      echo "🌐 Step 2: API connectivity test..."
      npm run test:api
      
      echo "🔗 Step 3: Integration tests..."
      npm run test:integration
    else
      echo "⚠️ Skipping API tests - not deployed yet"
    fi
    
    echo "🎭 Step 4: E2E tests..."
    npx playwright install --with-deps chromium
    npm run test:e2e --project=chromium
    
    echo "📊 Step 5: Coverage report..."
    npm run test:coverage
    ;;
    
  *)
    echo "❌ Unknown test type: $TEST_TYPE"
    echo ""
    echo "Usage: ./run-tests-improved.sh [test-type]"
    echo ""
    echo "Available test types:"
    echo "  unit        - Unit tests only (fast)"
    echo "  integration - API integration tests (requires deployment)"
    echo "  e2e         - End-to-end browser tests"
    echo "  api         - API connectivity test (requires deployment)"
    echo "  coverage    - Tests with coverage report"
    echo "  quick       - Unit + E2E tests (good for development)"
    echo "  all         - All tests (default)"
    echo ""
    exit 1
    ;;
esac

cd ../../

echo ""
echo "✅ Testing complete!"
echo ""
echo "📋 Configuration detected:"
if [[ -n "$API_BASE_URL" && "$API_BASE_URL" != "http://localhost:3000/api" ]]; then
  echo "   🎯 API URL: $API_BASE_URL"
  echo "   ✅ Ready for full testing including API/integration tests"
else
  echo "   ⚠️ API URL: Not deployed yet"
  echo "   📝 Deploy with: ./deploy-to-aws.sh"
fi
echo ""
echo "🎪 QUICK TEST COMMANDS:"
echo "  ./run-tests-improved.sh quick      - Fast tests (unit + E2E)"
echo "  ./run-tests-improved.sh unit       - Unit tests only"
echo "  ./run-tests-improved.sh e2e        - Browser tests only"
echo "  ./run-tests-improved.sh all        - Everything (auto-detects API)"
echo ""