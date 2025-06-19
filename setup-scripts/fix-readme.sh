#!/bin/bash

# Quick fix for README.md placement
# The README.md should be in the root of the multi-tenant-payroll-saas directory

echo "🔧 Fixing README.md location..."

# Create the README.md in the correct location
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

echo "✅ README.md created successfully!"

# Also fix the Dockerfile location if it's missing
if [ ! -f "Dockerfile" ]; then
    echo "🔧 Creating Dockerfile..."
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
EOF
    echo "✅ Dockerfile created successfully!"
fi

echo "🎉 All missing files have been created. Please run the validation script again."