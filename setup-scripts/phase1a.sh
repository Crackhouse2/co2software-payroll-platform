#!/bin/bash

# Phase 1a: Complete Multi-Tenant Serverless Payroll System - Project Structure
# This script creates the complete monorepo structure with all necessary configurations
# Optimized for Claude Projects with comprehensive documentation and type safety

set -e

echo "🚀 Creating Multi-Tenant Serverless Payroll System - Phase 1a: Project Structure"
echo "=================================================================="

# Create main project directory
PROJECT_NAME="multi-tenant-payroll-saas"
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

echo "📁 Creating monorepo folder structure..."

# Create main package structure
mkdir -p packages/{shared,infrastructure,workers,processors,web-worker,web-payroll}
mkdir -p packages/domains/{employees,timesheets,payments,approvals}
mkdir -p packages/testing/{e2e,load,utilities}
mkdir -p packages/docs
mkdir -p tools/{scripts,templates}
mkdir -p environments/{local,play,dev,stage,prod}

echo "📄 Creating root package.json with workspace configuration..."

# Root package.json with comprehensive workspace setup
cat > package.json << 'EOF'
{
  "name": "@co2software/payroll-saas",
  "version": "1.0.0",
  "description": "Multi-tenant serverless payroll system for co2software and enterprise customers",
  "private": true,
  "workspaces": [
    "packages/*",
    "packages/domains/*",
    "packages/testing/*"
  ],
  "scripts": {
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "test:unit": "jest --coverage --passWithNoTests",
    "test:e2e": "npm run test:e2e -w @co2software/testing-e2e",
    "test:load": "npm run test:load -w @co2software/testing-load",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "dev": "npm run dev --workspaces --if-present",
    "deploy:local": "npm run cdk:deploy -w @co2software/infrastructure -- --profile local",
    "deploy:play": "npm run cdk:deploy -w @co2software/infrastructure -- --profile play",
    "deploy:dev": "npm run cdk:deploy -w @co2software/infrastructure -- --profile dev",
    "deploy:stage": "npm run cdk:deploy -w @co2software/infrastructure -- --profile stage",
    "deploy:prod": "npm run cdk:deploy -w @co2software/infrastructure -- --profile prod",
    "cdk:diff": "npm run cdk:diff -w @co2software/infrastructure",
    "cdk:synth": "npm run cdk:synth -w @co2software/infrastructure",
    "seed:data": "npm run seed -w @co2software/shared",
    "clean": "npm run clean --workspaces --if-present && rm -rf node_modules",
    "postinstall": "husky install"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "husky": "^8.0.0",
    "jest": "^29.5.0",
    "lint-staged": "^14.0.0",
    "prettier": "^3.0.0",
    "ts-jest": "^29.1.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.2.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/co2software/multi-tenant-payroll-saas"
  },
  "keywords": [
    "payroll",
    "multi-tenant",
    "serverless",
    "aws",
    "typescript",
    "saas",
    "co2software"
  ],
  "author": "co2software <dev@co2software.co.uk>",
  "license": "PROPRIETARY"
}
EOF

echo "⚙️ Creating TypeScript configuration..."

# Root tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022", "DOM"],
    "allowJs": true,
    "checkJs": false,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./",
    "composite": true,
    "removeComments": false,
    "noEmit": false,
    "importHelpers": true,
    "downlevelIteration": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@co2software/shared/*": ["packages/shared/src/*"],
      "@co2software/infrastructure/*": ["packages/infrastructure/src/*"],
      "@co2software/workers/*": ["packages/workers/src/*"],
      "@co2software/processors/*": ["packages/processors/src/*"],
      "@co2software/web-worker/*": ["packages/web-worker/src/*"],
      "@co2software/web-payroll/*": ["packages/web-payroll/src/*"],
      "@co2software/employees/*": ["packages/domains/employees/src/*"],
      "@co2software/timesheets/*": ["packages/domains/timesheets/src/*"],
      "@co2software/payments/*": ["packages/domains/payments/src/*"],
      "@co2software/approvals/*": ["packages/domains/approvals/src/*"],
      "@co2software/testing-utilities/*": ["packages/testing/utilities/src/*"]
    },
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": [
    "packages/**/*",
    "tools/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "cdk.out",
    "**/*.test.ts",
    "**/*.spec.ts"
  ],
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/infrastructure" },
    { "path": "./packages/workers" },
    { "path": "./packages/processors" },
    { "path": "./packages/web-worker" },
    { "path": "./packages/web-payroll" },
    { "path": "./packages/domains/employees" },
    { "path": "./packages/domains/timesheets" },
    { "path": "./packages/domains/payments" },
    { "path": "./packages/domains/approvals" },
    { "path": "./packages/testing/utilities" }
  ]
}
EOF

echo "🎨 Creating ESLint configuration..."

# ESLint configuration
cat > .eslintrc.js << 'EOF'
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    // TypeScript specific rules for better code quality
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    
    // General code quality rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error'
  },
  env: {
    node: true,
    es2022: true,
    jest: true
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'cdk.out/',
    '*.js'
  ]
};
EOF

echo "💅 Creating Prettier configuration..."

# Prettier configuration
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
EOF

# Prettier ignore
cat > .prettierignore << 'EOF'
dist/
node_modules/
cdk.out/
coverage/
*.md
*.yml
*.yaml
EOF

echo "🧪 Creating Jest configuration..."

# Jest configuration
cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'packages/**/*.ts',
    '!packages/**/*.d.ts',
    '!packages/**/node_modules/**',
    '!packages/**/dist/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  moduleNameMapping: {
    '^@co2software/shared/(.*)$': '<rootDir>/packages/shared/src/$1',
    '^@co2software/infrastructure/(.*)$': '<rootDir>/packages/infrastructure/src/$1',
    '^@co2software/workers/(.*)$': '<rootDir>/packages/workers/src/$1',
    '^@co2software/processors/(.*)$': '<rootDir>/packages/processors/src/$1',
    '^@co2software/employees/(.*)$': '<rootDir>/packages/domains/employees/src/$1',
    '^@co2software/timesheets/(.*)$': '<rootDir>/packages/domains/timesheets/src/$1',
    '^@co2software/payments/(.*)$': '<rootDir>/packages/domains/payments/src/$1',
    '^@co2software/approvals/(.*)$': '<rootDir>/packages/domains/approvals/src/$1',
    '^@co2software/testing-utilities/(.*)$': '<rootDir>/packages/testing/utilities/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000
};
EOF

# Jest setup file
cat > jest.setup.js << 'EOF'
// Global test setup for all Jest tests
// Configure AWS SDK mocks, test utilities, and global test environment

// Mock AWS SDK v3
jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/client-cognito-identity-provider');
jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/client-stepfunctions');

// Global test timeout
jest.setTimeout(30000);

// Global test utilities
global.testTenantId = 'co2software';
global.testUserId = 'test-user-123';
global.mockDate = new Date('2024-01-15T10:00:00Z');

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
EOF

echo "🔧 Creating development tooling..."

# Husky pre-commit hooks
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run type-check
npm run test:unit
EOF

chmod +x .husky/pre-commit

# Lint-staged configuration
cat > .lintstagedrc << 'EOF'
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
EOF

echo "🌍 Creating environment configurations..."

# Local environment config
cat > environments/local/config.json << 'EOF'
{
  "environment": "local",
  "tenant": "co2software",
  "region": "eu-west-2",
  "accountId": "123456789012",
  "domain": "localhost:3000",
  "features": {
    "multiRegionDR": false,
    "detailedXRayTracing": false,
    "kinesisAnalytics": false,
    "sageMakerML": false,
    "guardDuty": false,
    "advancedWAF": false,
    "cloudWatchSynthetics": false,
    "awsConfig": false,
    "detailedMonitoring": false
  },
  "nonStartup": {
    "essential": {
      "multiRegionDR": false,
      "detailedXRayTracing": false,
      "kinesisAnalytics": false,
      "sageMakerML": false
    },
    "niceToHave": {
      "guardDuty": false,
      "advancedWAF": false,
      "cloudWatchSynthetics": false,
      "awsConfig": false,
      "detailedMonitoring": false
    }
  }
}
EOF

# Play environment config
cat > environments/play/config.json << 'EOF'
{
  "environment": "play",
  "tenant": "co2software",
  "region": "eu-west-2",
  "accountId": "123456789013",
  "domain": "play.co2software.co.uk",
  "features": {
    "multiRegionDR": false,
    "detailedXRayTracing": true,
    "kinesisAnalytics": false,
    "sageMakerML": false,
    "guardDuty": true,
    "advancedWAF": false,
    "cloudWatchSynthetics": false,
    "awsConfig": true,
    "detailedMonitoring": true
  },
  "nonStartup": {
    "essential": {
      "multiRegionDR": false,
      "detailedXRayTracing": true,
      "kinesisAnalytics": false,
      "sageMakerML": false
    },
    "niceToHave": {
      "guardDuty": true,
      "advancedWAF": false,
      "cloudWatchSynthetics": false,
      "awsConfig": true,
      "detailedMonitoring": true
    }
  }
}
EOF

# Production environment config template
cat > environments/prod/config.json << 'EOF'
{
  "environment": "prod",
  "tenant": "co2software",
  "region": "eu-west-2",
  "accountId": "123456789014",
  "domain": "payroll.co2software.co.uk",
  "features": {
    "multiRegionDR": true,
    "detailedXRayTracing": true,
    "kinesisAnalytics": true,
    "sageMakerML": true,
    "guardDuty": true,
    "advancedWAF": true,
    "cloudWatchSynthetics": true,
    "awsConfig": true,
    "detailedMonitoring": true
  },
  "nonStartup": {
    "essential": {
      "multiRegionDR": true,
      "detailedXRayTracing": true,
      "kinesisAnalytics": true,
      "sageMakerML": true
    },
    "niceToHave": {
      "guardDuty": true,
      "advancedWAF": true,
      "cloudWatchSynthetics": true,
      "awsConfig": true,
      "detailedMonitoring": true
    }
  }
}
EOF

echo "📋 Creating VS Code workspace configuration..."

# VS Code workspace settings
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/cdk.out": true,
    "**/coverage": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/cdk.out": true,
    "**/coverage": true
  },
  "eslint.workingDirectories": [
    "./packages/shared",
    "./packages/infrastructure",
    "./packages/workers",
    "./packages/processors",
    "./packages/web-worker",
    "./packages/web-payroll",
    "./packages/domains/employees",
    "./packages/domains/timesheets",
    "./packages/domains/payments",
    "./packages/domains/approvals"
  ],
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
EOF

# VS Code launch configuration for debugging
cat > .vscode/launch.json << 'EOF'
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "disableOptimisticBPs": true,
      "windows": {
        "program": "${workspaceFolder}/node_modules/jest/bin/jest"
      }
    },
    {
      "name": "Debug CDK App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/packages/infrastructure/bin/app.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "console": "integratedTerminal"
    }
  ]
}
EOF

# VS Code tasks
cat > .vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "build",
      "type": "npm",
      "script": "build",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "test",
      "type": "npm",
      "script": "test",
      "group": "test",
      "presentation": {
        "reveal": "always",
        "panel": "new"  
      }
    },
    {
      "label": "cdk deploy",
      "type": "shell",
      "command": "npm run deploy:local",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
EOF

echo "📚 Creating comprehensive documentation..."

# Main README
cat > README.md << 'EOF'
# Multi-Tenant Serverless Payroll SAAS Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue.svg)](https://www.typescriptlang.org/)
[![AWS CDK](https://img.shields.io/badge/AWS%20CDK-2.0+-orange.svg)](https://aws.amazon.com/cdk/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

A production-ready, enterprise-grade multi-tenant payroll system built on AWS serverless technologies. Designed for co2software and enterprise customers with full UK/US payroll compliance, advanced multi-tenancy, and scalable architecture.

## 🏗️ Architecture Overview

### Core Technologies
- **Backend**: AWS AppSync (GraphQL), DynamoDB, Step Functions, Lambda, Cognito
- **Frontend**: Next.js with dual portals (Worker & Payroll Operator)
- **Infrastructure**: AWS CDK v2 with TypeScript
- **Deployment**: Blue-green deployment with CDK Pipelines
- **Monitoring**: CloudWatch, X-Ray, Lambda Powertools

### Multi-Tenant Architecture
- **Tenant Isolation**: Configuration-driven customization per legal entity
- **Feature Flags**: Dynamic feature enablement per tenant
- **Custom Branding**: White-label capabilities with custom domains
- **Business Rules**: Configurable overtime, rounding, approval workflows
- **Compliance**: Region-specific payroll rules (UK AWR, US regulations)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- AWS CLI configured with appropriate permissions
- AWS CDK CLI: `npm install -g aws-cdk`

### Installation
```bash
git clone https://github.com/co2software/multi-tenant-payroll-saas
cd multi-tenant-payroll-saas
npm install
```

### Local Development
```bash
# Start local development environment
npm run dev

# Deploy to local AWS environment
npm run deploy:local

# Run tests
npm run test
npm run test:e2e
```

## 📁 Project Structure

```
multi-tenant-payroll-saas/
├── packages/
│   ├── shared/                 # Shared utilities, types, and configurations
│   ├── infrastructure/         # AWS CDK infrastructure definitions
│   ├── workers/               # Real-time GraphQL resolvers and handlers
│   ├── processors/            # Batch processing with Step Functions
│   ├── web-worker/           # Worker portal (timesheet entry, mobile-responsive)
│   ├── web-payroll/          # Payroll operator interface (desktop, admin)
│   └── domains/
│       ├── employees/        # Employee domain logic and schemas
│       ├── timesheets/       # Timesheet submission and validation
│       ├── payments/         # Payroll calculation and processing
│       └── approvals/        # Workflow and approval management
├── environments/             # Environment-specific configurations
├── tools/                   # Development scripts and templates
└── packages/testing/        # E2E, load testing, and test utilities
```

## 🎯 Core Features

### Employee Management
- **Self-Registration**: Invitation-based employee onboarding
- **Digital Documents**: Upload and e-signature integration
- **Right to Work**: Automated verification workflows
- **Multi-Classification**: Employee vs contractor with AWR compliance

### Timesheet System
- **Real-time Entry**: Mobile-responsive timesheet submission
- **Approval Workflows**: Configurable multi-level approvals
- **Overtime Rules**: Tenant-specific calculation rules
- **Audit Trails**: Complete change history with event sourcing

### Payroll Processing
- **Batch Calculations**: Step Functions orchestrated processing
- **Multi-Region**: UK and US payroll rule compliance
- **Document Generation**: Automated payslips and reports
- **Banking Integration**: Secure payment processing

### Multi-Client Support
- **Agency Workers**: UK AWR regulation compliance
- **Contractor Management**: Classification and billing
- **White-label**: Custom branding per tenant
- **Usage Analytics**: Per-tenant metrics and billing

## 🛠️ Development

### Available Scripts
```bash
npm run build          # Build all packages
npm run test          # Run unit tests (90%+ coverage target)
npm run test:e2e      # Run Playwright end-to-end tests
npm run test:load     # Run performance tests (Playwright + Artillery)
npm run lint          # ESLint with TypeScript rules
npm run type-check    # TypeScript compilation check
npm run dev           # Start development servers
```

### Environment Management
- **Local**: Development with LocalStack integration
- **Play**: Feature testing environment
- **Dev**: Integration testing
- **Stage**: Pre-production validation
- **Prod**: Production deployment

### Testing Strategy
- **Unit Tests**: Jest with 90%+ coverage requirement
- **E2E Tests**: Playwright for complete user journeys
- **Load Tests**: Combined Playwright (user journey) + Artillery (API stress)
- **Performance**: Fargate-based testing with shared utilities

## 🏢 Multi-Tenant Configuration

### Tenant Setup (co2software Example)
```typescript
{
  "tenantId": "co2software",
  "domain": "payroll.co2software.co.uk",
  "branding": {
    "primaryColor": "#1976d2",
    "logo": "co2software-logo.svg",
    "companyName": "co2software Ltd"
  },
  "features": {
    "isRecruiter": true,
    "contractorSupport": true,
    "awrCompliance": true,
    "multiClient": true
  },
  "businessRules": {
    "overtimeThreshold": 40,
    "roundingMinutes": 15,
    "approvalLevels": 2
  }
}
```

### AWS Organization Structure
- **Root Account**: Master oversight across all SAAS domains
- **Monitoring Account**: Centralized observability
- **Domain Accounts**: co2software master with sub-accounts
- **Capability Accounts**: Service-specific to avoid limits
- **Cross-Account Roles**: Secure deployment and monitoring

## 🔒 Security & Compliance

### Security Features
- **WAF Protection**: Application-level security
- **VPC Endpoints**: Private AWS service communication
- **Secrets Management**: AWS Secrets Manager integration
- **MFA Enforcement**: Multi-factor authentication
- **Zero Trust**: Principle of least privilege

### Developer Permission Levels
1. **Junior Dev**: Read access, basic Lambda deployment
2. **Mid-level Dev**: Feature development, non-prod deployment
3. **Senior Dev**: Full development, staging deployment
4. **Lead Dev**: Production access, infrastructure changes

### Compliance
- **GDPR**: Data protection and privacy controls
- **SOX**: Financial audit trails and controls
- **AWS Config**: Compliance rule monitoring
- **Encryption**: At-rest and in-transit encryption

## 💰 Cost Optimization

### Startup Mode Configuration
Configurable expensive features via `nonStartup` flags:
- Essential: Multi-region DR, detailed tracing, ML features
- Nice-to-have: Advanced monitoring, GuardDuty, enhanced WAF

### Cost Monitoring
- Per-tenant cost allocation
- Automated optimization recommendations
- Usage-based billing integration
- S3 Intelligent Tiering and lifecycle policies

## 📊 Monitoring & Observability

### Observability Stack
- **Lambda Powertools**: Structured logging, metrics, tracing
- **X-Ray**: Service maps and distributed tracing
- **CloudWatch**: Metrics, alarms, and dashboards
- **Synthetics**: Critical path monitoring (configurable)

### Alerting
- **Composite Alarms**: Multi-metric alerting
- **AWS Chatbot**: Slack/Teams integration
- **DLQ Monitoring**: Failed message tracking
- **Cost Alerts**: Budget and spend notifications

## 🚦 CI/CD Pipeline

### Deployment Strategy
- **CDK Pipelines**: Self-mutating infrastructure
- **Blue-Green**: Zero-downtime deployments
- **Feature Branches**: Dynamic environment creation
- **Automated Rollback**: Health check-based rollback

### Quality Gates
- **SAST/DAST**: Security scanning
- **Policy as Code**: Infrastructure validation
- **Contract Testing**: API compatibility with Pact
- **Chaos Engineering**: AWS Fault Injection Simulator

## 📖 API Documentation

GraphQL API documentation is auto-generated and available at:
- Local: `http://localhost:4000/graphql`
- Play: `https://api-play.co2software.co.uk/graphql`
- Production: `https://api.payroll.co2software.co.uk/graphql`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- 90%+ test coverage requirement
- Comprehensive JSDoc/TSDoc comments
- Descriptive commit messages

## 📞 Support

- **Documentation**: Internal wiki and runbooks
- **Issues**: GitHub Issues for bug reports
- **Security**: security@co2software.co.uk
- **General**: dev@co2software.co.uk

## 📄 License

This project is proprietary software owned by co2software Ltd. All rights reserved.

---

**Built with ❤️ by co2software for enterprise payroll excellence**
EOF

# Docker configuration for development
cat > Dockerfile << 'EOF'
FROM node:18-alpine

# Install AWS CLI and CDK
RUN apk add --no-cache aws-cli python3 py3-pip
RUN npm install -g aws-cdk

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/*/package*.json ./packages/*/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000 4000

CMD ["npm", "run", "dev"]