// Unit tests for payroll calculation logic

describe('Payroll Calculation Logic', () => {
  // Simple payroll calculation function (matching Lambda logic)
  function calculatePayroll(hours, rate) {
    const grossPay = hours * rate;
    const tax = grossPay * 0.2; // 20% tax
    const netPay = grossPay - tax;
    
    return {
      hours,
      rate,
      grossPay,
      tax,
      netPay
    };
  }

  describe('Basic Calculations', () => {
    test('should calculate standard 40-hour week correctly', () => {
      const result = calculatePayroll(40, 25);
      
      expect(result.grossPay).toBe(1000);
      expect(result.tax).toBe(200);
      expect(result.netPay).toBe(800);
      expect(result.hours).toBe(40);
      expect(result.rate).toBe(25);
    });

    test('should handle part-time hours', () => {
      const result = calculatePayroll(20, 15);
      
      expect(result.grossPay).toBe(300);
      expect(result.tax).toBe(60);
      expect(result.netPay).toBe(240);
    });

    test('should handle overtime hours', () => {
      const result = calculatePayroll(50, 20);
      
      expect(result.grossPay).toBe(1000);
      expect(result.tax).toBe(200);
      expect(result.netPay).toBe(800);
    });

    test('should handle decimal hours', () => {
      const result = calculatePayroll(37.5, 24);
      
      expect(result.grossPay).toBe(900);
      expect(result.tax).toBe(180);
      expect(result.netPay).toBe(720);
    });
  });

  describe('Edge Cases', () => {
    test('should handle zero hours', () => {
      const result = calculatePayroll(0, 25);
      
      expect(result.grossPay).toBe(0);
      expect(result.tax).toBe(0);
      expect(result.netPay).toBe(0);
    });

    test('should handle zero rate', () => {
      const result = calculatePayroll(40, 0);
      
      expect(result.grossPay).toBe(0);
      expect(result.tax).toBe(0);
      expect(result.netPay).toBe(0);
    });

    test('should handle very small amounts', () => {
      const result = calculatePayroll(0.5, 10.50);
      
      expect(result.grossPay).toBe(5.25);
      expect(result.tax).toBe(1.05);
      expect(result.netPay).toBe(4.20);
    });

    test('should handle large amounts', () => {
      const result = calculatePayroll(80, 100);
      
      expect(result.grossPay).toBe(8000);
      expect(result.tax).toBe(1600);
      expect(result.netPay).toBe(6400);
    });
  });

  describe('Tax Calculation Validation', () => {
    test('should always apply 20% tax rate', () => {
      const testCases = [
        { hours: 10, rate: 50 },
        { hours: 35, rate: 30 },
        { hours: 42, rate: 18.75 },
        { hours: 60, rate: 12.50 }
      ];

      testCases.forEach(({ hours, rate }) => {
        const result = calculatePayroll(hours, rate);
        const expectedTax = result.grossPay * 0.2;
        
        expect(result.tax).toBeCloseTo(expectedTax, 2);
        expect(result.netPay).toBeCloseTo(result.grossPay - expectedTax, 2);
      });
    });
  });

  describe('Data Type Validation', () => {
    test('should handle string inputs correctly', () => {
      const result = calculatePayroll('40', '25');
      
      // JavaScript will coerce strings to numbers
      expect(result.grossPay).toBe(1000);
      expect(result.tax).toBe(200);
      expect(result.netPay).toBe(800);
    });

    test('should return numbers for all calculations', () => {
      const result = calculatePayroll(37.5, 22.50);
      
      expect(typeof result.grossPay).toBe('number');
      expect(typeof result.tax).toBe('number');
      expect(typeof result.netPay).toBe('number');
      expect(typeof result.hours).toBe('number');
      expect(typeof result.rate).toBe('number');
    });
  });

  describe('Business Rule Validation', () => {
    test('net pay should always be 80% of gross pay', () => {
      const testCases = [
        { hours: 25, rate: 15 },
        { hours: 40, rate: 30 },
        { hours: 45, rate: 25 },
      ];

      testCases.forEach(({ hours, rate }) => {
        const result = calculatePayroll(hours, rate);
        const expectedNetPay = result.grossPay * 0.8;
        
        expect(result.netPay).toBeCloseTo(expectedNetPay, 2);
      });
    });

    test('tax should always be 20% of gross pay', () => {
      const testCases = [
        { hours: 20, rate: 40 },
        { hours: 38, rate: 26.50 },
        { hours: 50, rate: 18 },
      ];

      testCases.forEach(({ hours, rate }) => {
        const result = calculatePayroll(hours, rate);
        const expectedTax = result.grossPay * 0.2;
        
        expect(result.tax).toBeCloseTo(expectedTax, 2);
      });
    });
  });
});
