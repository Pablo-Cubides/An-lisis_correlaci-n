import {
  validateFile,
  validateNumericData,
  cleanNumericValue,
  isValidNumericValue,
} from '../lib/validators';

describe('Validators', () => {
  describe('validateFile', () => {
    test('accepts CSV files', () => {
      const file = new File(['col1,col2\n1,2'], 'data.csv', { type: 'text/csv' });
      const result = validateFile(file);
      expect(result.valid).toBe(true);
    });

    test('accepts XLSX files', () => {
      const file = new File([''], 'data.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const result = validateFile(file);
      expect(result.valid).toBe(true);
    });

    test('rejects invalid extensions', () => {
      const file = new File([''], 'data.txt', { type: 'text/plain' });
      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('csv');
    });

    test('rejects files larger than 20MB', () => {
      const largeContent = 'x'.repeat(21 * 1024 * 1024);
      const file = new File([largeContent], 'large.csv', { type: 'text/csv' });
      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('demasiado grande');
    });

    test('accepts .xls files', () => {
      const file = new File([''], 'data.xls', { type: 'application/vnd.ms-excel' });
      const result = validateFile(file);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateNumericData', () => {
    test('accepts valid numeric data', () => {
      const data = [
        { col1: 1, col2: 2 },
        { col1: 3, col2: 4 },
      ];
      const result = validateNumericData(data);
      expect(result.valid).toBe(true);
      expect(result.numericColumns).toContain('col1');
      expect(result.numericColumns).toContain('col2');
    });

    test('rejects empty data', () => {
      const result = validateNumericData([]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('vacío');
    });

    test('requires at least 2 numeric columns', () => {
      const data = [
        { col1: 1, col2: 'text' },
        { col1: 3, col2: 'more' },
      ];
      const result = validateNumericData(data);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('al menos 2');
    });

    test('detects numeric columns correctly', () => {
      const data = [
        { col1: 1, col2: 2, col3: 'text' },
        { col1: 3, col2: 4, col3: 'more' },
      ];
      const result = validateNumericData(data);
      expect(result.valid).toBe(true);
      expect(result.numericColumns).toHaveLength(2);
    });

    test('handles mixed numeric and non-numeric data', () => {
      const data = [
        { name: 'Alice', age: 30, score: 85.5 },
        { name: 'Bob', age: 25, score: 90 },
      ];
      const result = validateNumericData(data);
      expect(result.valid).toBe(true);
      expect(result.numericColumns).toContain('age');
      expect(result.numericColumns).toContain('score');
      expect(result.numericColumns).not.toContain('name');
    });
  });

  describe('cleanNumericValue', () => {
    test('returns number as-is', () => {
      expect(cleanNumericValue(5)).toBe(5);
    });

    test('parses string numbers', () => {
      expect(cleanNumericValue('5')).toBe(5);
      expect(cleanNumericValue('5.5')).toBe(5.5);
    });

    test('returns null for NaN', () => {
      expect(cleanNumericValue(NaN)).toBeNull();
      expect(cleanNumericValue('abc')).toBeNull();
    });

    test('handles negative numbers', () => {
      expect(cleanNumericValue(-5)).toBe(-5);
      expect(cleanNumericValue('-5')).toBe(-5);
    });

    test('handles null and undefined', () => {
      expect(cleanNumericValue(null)).toBeNull();
      expect(cleanNumericValue(undefined)).toBeNull();
    });

    test('handles whitespace in strings', () => {
      expect(cleanNumericValue('  5  ')).toBe(5);
    });
  });

  describe('isValidNumericValue', () => {
    test('accepts valid numbers', () => {
      expect(isValidNumericValue(5)).toBe(true);
      expect(isValidNumericValue(-5)).toBe(true);
      expect(isValidNumericValue(0)).toBe(true);
      expect(isValidNumericValue(3.14)).toBe(true);
    });

    test('rejects NaN', () => {
      expect(isValidNumericValue(NaN)).toBe(false);
    });

    test('rejects Infinity', () => {
      expect(isValidNumericValue(Infinity)).toBe(false);
      expect(isValidNumericValue(-Infinity)).toBe(false);
    });

    test('rejects non-numbers', () => {
      // @ts-expect-error - Testing type safety
      expect(isValidNumericValue('5')).toBe(false);
    });

    test('accepts very large and small numbers', () => {
      expect(isValidNumericValue(1e-308)).toBe(true);
      expect(isValidNumericValue(1e308)).toBe(true);
    });
  });
});
