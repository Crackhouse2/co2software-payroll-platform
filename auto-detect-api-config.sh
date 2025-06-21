#!/bin/bash

# Auto-detect API URL from existing configuration
# File: auto-detect-api-config.sh
# Command: ./auto-detect-api-config.sh

set -e

echo "🔍 Auto-detecting API URL from existing configuration..."

# Function to extract API URL from config.js
extract_api_url_from_config() {
  local config_file="packages/admin-ui/src/config.js"
  
  if [[ -f "$config_file" ]]; then
    # Extract API_BASE_URL from config.js
    local api_url=$(grep -o "API_BASE_URL: '[^']*'" "$config_file" | sed "s/API_BASE_URL: '//g" | sed "s/'//g")
    
    if [[ -n "$api_url" && "$api_url" != "http://localhost:3000/api" ]]; then
      echo "$api_url"
      return 0
    fi
  fi
  
  return 1
}

# Function to extract API URL from .env file
extract_api_url_from_env() {
  local env_file="packages/admin-ui/.env"
  
  if [[ -f "$env_file" ]]; then
    # Extract API_BASE_URL from .env file
    local api_url=$(grep "^API_BASE_URL=" "$env_file" | cut -d'=' -f2)
    
    if [[ -n "$api_url" && "$api_url" != "http://localhost:3000/api" ]]; then
      echo "$api_url"
      return 0
    fi
  fi
  
  return 1
}

# Function to extract API URL from AWS CloudFormation
extract_api_url_from_aws() {
  if command -v aws &> /dev/null; then
    local api_url=$(aws cloudformation describe-stacks --stack-name Co2SoftwarePayrollAuth --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' --output text 2>/dev/null)
    
    if [[ -n "$api_url" && "$api_url" != "None" ]]; then
      echo "$api_url"
      return 0
    fi
  fi
  
  return 1
}

# Try to detect API URL from various sources
echo "📡 Checking configuration sources..."

API_URL=""

# 1. Try config.js first
if API_URL=$(extract_api_url_from_config); then
  echo "✅ Found API URL in config.js: $API_URL"
elif API_URL=$(extract_api_url_from_env); then
  echo "✅ Found API URL in .env file: $API_URL"
elif API_URL=$(extract_api_url_from_aws); then
  echo "✅ Found API URL from AWS CloudFormation: $API_URL"
else
  echo "❌ Could not auto-detect API URL"
  echo ""
  echo "🔧 Manual options:"
  echo "1. Check if deployment completed: aws cloudformation describe-stacks --stack-name Co2SoftwarePayrollAuth"
  echo "2. Set manually: export API_BASE_URL=https://your-api-url.execute-api.eu-west-2.amazonaws.com/prod"
  echo "3. Re-run deployment: ./deploy-to-aws.sh"
  exit 1
fi

# Export the detected API URL
export API_BASE_URL="$API_URL"

echo ""
echo "🎯 API URL detected and exported:"
echo "   API_BASE_URL=$API_BASE_URL"
echo ""
echo "✅ Environment variable set automatically!"

# Verify the API is reachable
echo "🔍 Testing API connectivity..."
if curl -s -f -X POST "$API_URL/calculate-payroll" \
  -H "Content-Type: application/json" \
  -d '{"hours":1,"rate":1}' > /dev/null; then
  echo "✅ API is reachable and responding"
else
  echo "⚠️ API URL detected but not responding (might be cold start)"
fi

echo ""
echo "🚀 Ready to run tests with auto-detected API URL!"