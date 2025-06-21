#!/bin/bash

# Test Runner Script
# File: run-tests.sh
# Command: ./run-tests.sh [test-type]

set -e

cd packages/testing

echo "🧪 co2software Payroll Testing Suite"
echo "======================================"

# Parse arguments
TEST_TYPE=${1:-"all"}

case $TEST_TYPE in
  "unit")
    echo "🔢 Running unit tests..."
    npm run test:unit
    ;;
    
  "integration")
    echo "🔗 Running integration tests..."
    if [ -z "$API_BASE_URL" ]; then
      echo "⚠️ Set API_BASE_URL environment variable for integration tests"
      echo "Example: export API_BASE_URL=https://your-api.execute-api.eu-west-2.amazonaws.com/prod"
    else
      npm run test:integration
    fi
    ;;
    
  "e2e")
    echo "🎭 Running E2E tests..."
    # Install Playwright browsers if needed
    npx playwright install
    npm run test:e2e
    ;;
    
  "api")
    echo "🌐 Running API tests..."
    npm run test:api
    ;;
    
  "coverage")
    echo "📊 Running tests with coverage..."
    npm run test:coverage
    ;;
    
  "all")
    echo "🚀 Running all tests..."
    
    echo "📊 Step 1: Unit tests..."
    npm run test:unit
    
    echo "🌐 Step 2: API connectivity test..."
    npm run test:api
    
    echo "🎭 Step 3: E2E tests..."
    npx playwright install --with-deps
    npm run test:e2e
    
    if [ ! -z "$API_BASE_URL" ]; then
      echo "🔗 Step 4: Integration tests..."
      npm run test:integration
    else
      echo "⚠️ Skipping integration tests - API_BASE_URL not set"
    fi
    
    echo "📊 Step 5: Coverage report..."
    npm run test:coverage
    ;;
    
  *)
    echo "❌ Unknown test type: $TEST_TYPE"
    echo "Usage: ./run-tests.sh [unit|integration|e2e|api|coverage|all]"
    exit 1
    ;;
esac

echo ""
echo "✅ Testing complete!"
echo ""
echo "📋 Available test commands:"
echo "  ./run-tests.sh unit        - Unit tests only"
echo "  ./run-tests.sh integration - API integration tests"
echo "  ./run-tests.sh e2e         - End-to-end browser tests"
echo "  ./run-tests.sh api         - API connectivity test"
echo "  ./run-tests.sh coverage    - Tests with coverage report"
echo "  ./run-tests.sh all         - All tests (default)"
echo ""
