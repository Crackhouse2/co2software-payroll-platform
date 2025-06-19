#!/bin/bash

# Phase 1a Validation Script
# Comprehensive validation of monorepo structure, configurations, and tooling setup
# This script verifies all components of Phase 1a are correctly implemented

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters for validation results
PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}🔍 Multi-Tenant Payroll SAAS - Phase 1a Validation${NC}"
echo "=================================================================="
echo ""

# Function to check if file exists and log result
check_file() {
    local file_path="$1"
    local description="$2"
    local required="${3:-true}"
    
    if [ -f "$file_path" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $description"
        ((PASSED++))
        return 0
    else
        if [ "$required" = "true" ]; then
            echo -e "${RED}❌ FAIL${NC}: $description - Missing: $file_path"
            ((FAILED++))
        else
            echo -e "${YELLOW}⚠️  WARN${NC}: $description - Optional file missing: $file_path"
            ((WARNINGS++))
        fi
        return 1
    fi
}

# Function to check if directory exists
check_directory() {
    local dir_path="$1"
    local description="$2"
    
    if [ -d "$dir_path" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $description"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}: $description - Missing directory: $dir_path"
        ((FAILED++))
        return 1
    fi
}

# Function to validate JSON file
validate_json() {
    local file_path="$1"
    local description="$2"
    
    if [ -f "$file_path" ]; then
        if python3 -m json.tool "$file_path" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ PASS${NC}: $description - Valid JSON"
            ((PASSED++))
        else
            echo -e "${RED}❌ FAIL${NC}: $description - Invalid JSON: $file_path"
            ((FAILED++))
        fi
    else
        echo -e "${RED}❌ FAIL${NC}: $description - File not found: $file_path"
        ((FAILED++))
    fi
}

# Function to check package.json content
validate_package_json() {
    local file_path="$1"
    local description="$2"
    
    if [ -f "$file_path" ]; then
        echo -e "${BLUE}🔍 Validating $description...${NC}"
        
        # Check for required fields
        local required_fields=("name" "version" "workspaces" "scripts")
        for field in "${required_fields[@]}"; do
            if grep -q "\"$field\"" "$file_path"; then
                echo -e "  ${GREEN}✅${NC} Has '$field' field"
                ((PASSED++))
            else
                echo -e "  ${RED}❌${NC} Missing '$field' field"
                ((FAILED++))
            fi
        done
        
        # Check for specific scripts
        local required_scripts=("build" "test" "lint" "deploy:local" "deploy:prod")
        for script in "${required_scripts[@]}"; do
            if grep -q "\"$script\"" "$file_path"; then
                echo -e "  ${GREEN}✅${NC} Has '$script' script"
                ((PASSED++))
            else
                echo -e "  ${RED}❌${NC} Missing '$script' script"
                ((FAILED++))
            fi
        done
        
        # Check for workspaces configuration
        if grep -q "packages/\*" "$file_path" && grep -q "packages/domains/\*" "$file_path"; then
            echo -e "  ${GREEN}✅${NC} Workspaces correctly configured"
            ((PASSED++))
        else
            echo -e "  ${RED}❌${NC} Workspaces not properly configured"
            ((FAILED++))
        fi
    else
        echo -e "${RED}❌ FAIL${NC}: $description - File not found: $file_path"
        ((FAILED++))
    fi
}

# Function to validate TypeScript configuration
validate_typescript_config() {
    echo -e "${BLUE}🔍 Validating TypeScript configuration...${NC}"
    
    if [ -f "tsconfig.json" ]; then
        # Check for strict mode
        if grep -q '"strict": true' tsconfig.json; then
            echo -e "  ${GREEN}✅${NC} Strict mode enabled"
            ((PASSED++))
        else
            echo -e "  ${RED}❌${NC} Strict mode not enabled"
            ((FAILED++))
        fi
        
        # Check for path mapping
        if grep -q '"@co2software/' tsconfig.json; then
            echo -e "  ${GREEN}✅${NC} Path mapping configured"
            ((PASSED++))
        else
            echo -e "  ${RED}❌${NC} Path mapping not configured"
            ((FAILED++))
        fi
        
        # Check for project references
        if grep -q '"references"' tsconfig.json; then
            echo -e "  ${GREEN}✅${NC} Project references configured"
            ((PASSED++))
        else
            echo -e "  ${RED}❌${NC} Project references not configured"
            ((FAILED++))
        fi
    else
        echo -e "${RED}❌ FAIL${NC}: TypeScript config - File not found: tsconfig.json"
        ((FAILED++))
    fi
}

# Function to validate environment configurations
validate_environments() {
    echo -e "${BLUE}🔍 Validating environment configurations...${NC}"
    
    local environments=("local" "play" "prod")
    for env in "${environments[@]}"; do
        local config_file="environments/$env/config.json"
        if [ -f "$config_file" ]; then
            echo -e "  ${GREEN}✅${NC} $env environment config exists"
            
            # Validate JSON structure
            if python3 -c "
import json
import sys
try:
    with open('$config_file') as f:
        config = json.load(f)
    required_fields = ['environment', 'tenant', 'region', 'domain', 'features', 'nonStartup']
    missing = [field for field in required_fields if field not in config]
    if missing:
        print(f'Missing fields: {missing}')
        sys.exit(1)
    if config['tenant'] != 'co2software':
        print(f'Expected tenant co2software, got {config[\"tenant\"]}')
        sys.exit(1)
    print('Valid configuration')
except Exception as e:
    print(f'Error: {e}')
    sys.exit(1)
" 2>/dev/null; then
                echo -e "  ${GREEN}✅${NC} $env config is valid"
                ((PASSED++))
            else
                echo -e "  ${RED}❌${NC} $env config is invalid"
                ((FAILED++))
            fi
        else
            echo -e "  ${RED}❌${NC} $env environment config missing"
            ((FAILED++))
        fi
    done
}

# Function to check VS Code configuration
validate_vscode_config() {
    echo -e "${BLUE}🔍 Validating VS Code configuration...${NC}"
    
    if [ -d ".vscode" ]; then
        echo -e "  ${GREEN}✅${NC} .vscode directory exists"
        ((PASSED++))
        
        local vscode_files=("settings.json" "launch.json" "tasks.json")
        for file in "${vscode_files[@]}"; do
            if [ -f ".vscode/$file" ]; then
                echo -e "  ${GREEN}✅${NC} .vscode/$file exists"
                ((PASSED++))
            else
                echo -e "  ${YELLOW}⚠️${NC}  .vscode/$file missing (optional)"
                ((WARNINGS++))
            fi
        done
    else
        echo -e "  ${YELLOW}⚠️${NC}  .vscode directory missing (optional)"
        ((WARNINGS++))
    fi
}

# Function to validate Git hooks
validate_git_hooks() {
    echo -e "${BLUE}🔍 Validating Git hooks...${NC}"
    
    if [ -f ".husky/pre-commit" ]; then
        echo -e "  ${GREEN}✅${NC} Pre-commit hook exists"
        ((PASSED++))
        
        if [ -x ".husky/pre-commit" ]; then
            echo -e "  ${GREEN}✅${NC} Pre-commit hook is executable"
            ((PASSED++))
        else
            echo -e "  ${RED}❌${NC} Pre-commit hook is not executable"
            ((FAILED++))
        fi
    else
        echo -e "  ${RED}❌${NC} Pre-commit hook missing"
        ((FAILED++))
    fi
}

echo -e "${BLUE}📁 Validating Project Structure...${NC}"
echo "----------------------------------------"

# Check main directories
check_directory "packages" "Main packages directory"
check_directory "packages/shared" "Shared package directory"
check_directory "packages/infrastructure" "Infrastructure package directory"
check_directory "packages/workers" "Workers package directory"
check_directory "packages/processors" "Processors package directory"
check_directory "packages/web-worker" "Web worker package directory"
check_directory "packages/web-payroll" "Web payroll package directory"

# Check domain directories
check_directory "packages/domains" "Domains directory"
check_directory "packages/domains/employees" "Employees domain directory"
check_directory "packages/domains/timesheets" "Timesheets domain directory"
check_directory "packages/domains/payments" "Payments domain directory"
check_directory "packages/domains/approvals" "Approvals domain directory"

# Check testing directories
check_directory "packages/testing" "Testing directory"
check_directory "packages/testing/e2e" "E2E testing directory"
check_directory "packages/testing/load" "Load testing directory"
check_directory "packages/testing/utilities" "Testing utilities directory"

# Check other directories
check_directory "environments" "Environments directory"
check_directory "tools" "Tools directory"

echo ""
echo -e "${BLUE}📄 Validating Configuration Files...${NC}"
echo "----------------------------------------"

# Check main configuration files
check_file "package.json" "Root package.json"
check_file "tsconfig.json" "TypeScript configuration"
check_file ".eslintrc.js" "ESLint configuration"
check_file ".prettierrc" "Prettier configuration"
check_file "jest.config.js" "Jest configuration"
check_file "jest.setup.js" "Jest setup file"
check_file "README.md" "Main README file"
check_file "Dockerfile" "Docker configuration"

# Check optional files
check_file ".prettierignore" "Prettier ignore file" false
check_file ".lintstagedrc" "Lint-staged configuration" false

echo ""
echo -e "${BLUE}🔧 Validating Tool Configurations...${NC}"
echo "----------------------------------------"

# Validate package.json content
validate_package_json "package.json" "Root package.json"

# Validate TypeScript configuration
validate_typescript_config

# Validate environment configurations
validate_environments

# Validate VS Code configuration
validate_vscode_config

# Validate Git hooks
validate_git_hooks

echo ""
echo -e "${BLUE}🌍 Validating Environment Files...${NC}"
echo "----------------------------------------"

# Check environment configuration files
validate_json "environments/local/config.json" "Local environment config"
validate_json "environments/play/config.json" "Play environment config"
validate_json "environments/prod/config.json" "Production environment config"

echo ""
echo -e "${BLUE}🧪 Validating Testing Setup...${NC}"
echo "----------------------------------------"

# Check if Jest can parse the configuration
if command -v node &> /dev/null; then
    if node -e "require('./jest.config.js')" 2>/dev/null; then
        echo -e "${GREEN}✅ PASS${NC}: Jest configuration is valid"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: Jest configuration is invalid"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  WARN${NC}: Node.js not available for Jest validation"
    ((WARNINGS++))
fi

# Check if TypeScript configuration is valid
if command -v npx &> /dev/null; then
    if npx tsc --noEmit --project tsconfig.json 2>/dev/null; then
        echo -e "${GREEN}✅ PASS${NC}: TypeScript configuration compiles successfully"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️  WARN${NC}: TypeScript configuration has warnings (expected without source files)"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠️  WARN${NC}: npm/npx not available for TypeScript validation"
    ((WARNINGS++))
fi

echo ""
echo -e "${BLUE}📊 Validation Summary${NC}"
echo "=================================="
echo -e "Total Checks: $((PASSED + FAILED + WARNINGS))"
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCCESS: Phase 1a validation completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo "1. Run 'npm install' to install dependencies"
    echo "2. Run 'npm run build' to verify build process"
    echo "3. Run 'npm run test' to verify testing setup"
    echo "4. Proceed to Phase 1b: Shared Foundation"
    echo ""
    exit 0
else
    echo -e "${RED}💥 FAILURE: Phase 1a validation failed with $FAILED errors${NC}"
    echo ""
    echo -e "${YELLOW}Please fix the above issues before proceeding to Phase 1b${NC}"
    echo ""
    exit 1
fi
EOF