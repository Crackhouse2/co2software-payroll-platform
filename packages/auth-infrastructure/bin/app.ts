#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { AuthStack } from '../src/auth-stack';

const app = new App();

// Deploy to free tier with go-live optimization comments
new AuthStack(app, 'Co2SoftwarePayrollAuth', {
  env: {
    // 🚀 GO-LIVE OPTIMIZATION: Use specific AWS account/region
    // account: process.env.CDK_DEFAULT_ACCOUNT,
    // region: process.env.CDK_DEFAULT_REGION,
  },
  description: 'co2software Payroll Authentication Stack - Free Tier POC',
});
