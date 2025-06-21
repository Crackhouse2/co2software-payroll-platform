export interface TenantConfig {
  tenantId: string;
  environment: string;
  region: string;
  accountId: string;
}

export class TenantResourceNaming {
  constructor(private config: TenantConfig) {}

  get employeeTableName(): string {
    return `${this.config.tenantId}-employees-${this.config.environment}-${this.config.region}`;
  }

  get timesheetTableName(): string {
    return `${this.config.tenantId}-timesheets-${this.config.environment}-${this.config.region}`;
  }

  get payrollTableName(): string {
    return `${this.config.tenantId}-payroll-${this.config.environment}-${this.config.region}`;
  }

  get employeeLambdaName(): string {
    return `${this.config.tenantId}-employee-api-${this.config.environment}`;
  }

  get apiGatewayName(): string {
    return `${this.config.tenantId}-payroll-api-${this.config.environment}`;
  }

  get cognitoUserPoolName(): string {
    return `${this.config.tenantId}-users-${this.config.environment}`;
  }

  get documentsBucketName(): string {
    return `${this.config.tenantId}-documents-${this.config.environment}-${this.config.region}`;
  }

  get stackName(): string {
    return `${this.config.tenantId}-payroll-${this.config.environment}`;
  }
}

export function createCo2SoftwareConfig(environment: string): TenantConfig {
  const accountIds = {
    local: '123456789012',
    play: '123456789013', 
    dev: '123456789014',
    stage: '123456789015',
    prod: '123456789016'
  };

  return {
    tenantId: 'co2software',
    environment,
    region: 'eu-west-2',
    accountId: accountIds[environment as keyof typeof accountIds] || accountIds.local
  };
}
