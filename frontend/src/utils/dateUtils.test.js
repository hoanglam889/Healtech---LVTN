import { describe, it, expect } from 'vitest';
import { formatDate, formatVND } from './dateUtils';

describe('formatDate', () => {
  it('returns "—" for null', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('returns "—" for undefined', () => {
    expect(formatDate(undefined)).toBe('—');
  });

  it('returns "—" for empty string', () => {
    expect(formatDate('')).toBe('—');
  });

  it('formats a date string as DD/MM/YYYY', () => {
    expect(formatDate('2024-06-15')).toBe('15/06/2024');
  });

  it('pads single-digit day and month with zero', () => {
    expect(formatDate('2024-01-05')).toBe('05/01/2024');
  });

  it('handles end-of-year date correctly', () => {
    expect(formatDate('2023-12-31')).toBe('31/12/2023');
  });
});

describe('formatVND', () => {
  it('formats a positive amount as Vietnamese currency containing ₫', () => {
    const result = formatVND(150000);
    expect(result).toContain('₫');
    expect(result).toContain('150');
  });

  it('formats zero as currency', () => {
    const result = formatVND(0);
    expect(result).toContain('₫');
  });

  it('formats large amounts with thousand separators', () => {
    const result = formatVND(1000000);
    expect(result).toContain('₫');
    expect(result).toContain('1');
  });
});
