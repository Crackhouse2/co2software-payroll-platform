import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, EmployeeFilter } from '../types/employee';

export class EmployeeRepository {
  private client: DynamoDBDocumentClient;
  private tableName: string;
  private tenantId: string;

  constructor(tenantId: string, environment: string, region: string) {
    const dynamoClient = new DynamoDBClient({ region });
    this.client = DynamoDBDocumentClient.from(dynamoClient);
    this.tenantId = tenantId;
    // Each tenant gets completely separate table: co2software-employees-prod-eu-west-2
    this.tableName = `${tenantId}-employees-${environment}-${region}`;
  }

  async createEmployee(request: CreateEmployeeRequest, createdBy: string): Promise<Employee> {
    const employeeId = `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const employee: Employee = {
      tenantId: this.tenantId,
      employeeId,
      personalInfo: request.personalInfo,
      employment: {
        ...request.employment,
        status: 'ACTIVE'
      },
      payroll: request.payroll,
      metadata: {
        createdAt: now,
        updatedAt: now,
        createdBy,
        version: 1
      }
    };

    await this.client.send(new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: `EMPLOYEE#${employeeId}`,
        SK: `EMPLOYEE#${employeeId}`,
        GSI1PK: `DEPARTMENT#${employee.employment.department}`,
        GSI1SK: `STATUS#${employee.employment.status}#${employee.personalInfo.lastName}`,
        Type: 'EMPLOYEE',
        ...employee
      }
    }));

    return employee;
  }

  async getEmployee(employeeId: string): Promise<Employee | null> {
    const result = await this.client.send(new GetCommand({
      TableName: this.tableName,
      Key: {
        PK: `EMPLOYEE#${employeeId}`,
        SK: `EMPLOYEE#${employeeId}`
      }
    }));

    if (!result.Item) return null;

    const { PK, SK, GSI1PK, GSI1SK, Type, ...employee } = result.Item;
    return employee as Employee;
  }

  async updateEmployee(request: UpdateEmployeeRequest): Promise<Employee> {
    const now = new Date().toISOString();
    
    const updateExpression = 'SET #updatedAt = :now, version = version + :inc';
    const expressionAttributeNames: any = {
      '#updatedAt': 'updatedAt'
    };
    const expressionAttributeValues: any = {
      ':now': now,
      ':inc': 1
    };

    // Build dynamic update expression
    let updateParts: string[] = [];
    
    if (request.personalInfo) {
      updateParts.push('personalInfo = :personalInfo');
      expressionAttributeValues[':personalInfo'] = request.personalInfo;
    }
    
    if (request.employment) {
      updateParts.push('employment = :employment');
      expressionAttributeValues[':employment'] = request.employment;
    }
    
    if (request.payroll) {
      updateParts.push('payroll = :payroll');
      expressionAttributeValues[':payroll'] = request.payroll;
    }

    const finalUpdateExpression = updateParts.length > 0 
      ? `${updateExpression}, ${updateParts.join(', ')}`
      : updateExpression;

    const result = await this.client.send(new UpdateCommand({
      TableName: this.tableName,
      Key: {
        PK: `EMPLOYEE#${request.employeeId}`,
        SK: `EMPLOYEE#${request.employeeId}`
      },
      UpdateExpression: finalUpdateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }));

    const { PK, SK, GSI1PK, GSI1SK, Type, ...employee } = result.Attributes!;
    return employee as Employee;
  }

  async listEmployees(filter?: Omit<EmployeeFilter, 'tenantId'>): Promise<Employee[]> {
    const result = await this.client.send(new ScanCommand({
      TableName: this.tableName,
      FilterExpression: '#type = :type',
      ExpressionAttributeNames: {
        '#type': 'Type'
      },
      ExpressionAttributeValues: {
        ':type': 'EMPLOYEE'
      }
    }));

    if (!result.Items) return [];

    return result.Items.map(item => {
      const { PK, SK, GSI1PK, GSI1SK, Type, ...employee } = item;
      return employee as Employee;
    }).filter(employee => {
      if (!filter) return true;
      if (filter.status && employee.employment.status !== filter.status) return false;
      if (filter.department && employee.employment.department !== filter.department) return false;
      if (filter.employmentType && employee.employment.employmentType !== filter.employmentType) return false;
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        const fullName = `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`.toLowerCase();
        const email = employee.personalInfo.email.toLowerCase();
        if (!fullName.includes(searchLower) && !email.includes(searchLower)) return false;
      }
      return true;
    });
  }
}
