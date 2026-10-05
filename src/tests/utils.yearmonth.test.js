import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// YearMonth
describe('test utils guessDataType: GYearMonth', () => {
    test('valid data - standard year-month combinations', () => {
        const testData = [
            '1900-01',  // January 1900
            '1999-12',  // December 1999
            '2000-06',  // June 2000
            '2025-03',  // March 2025
            '2099-11'   // November 2099
        ];
        expect(guessDataType(testData)).toBe('GYearMonth');
    });

    test('valid data - edge cases', () => {
        const testData = [
            '1900-1',   // Minimum year, single digit month
            '2099-12',  // Maximum year, maximum month
            '2000-01',  // Century boundary, month with leading zero
            '1999-12',  // Pre-century boundary, maximum month
            '2001-1',   // Post-century boundary, single digit month
            '2024-2',   // Current year, single digit month
            '1998-2',   // Single digit month without leading zero
            '2004-11'   // Double digit month
        ];
        expect(guessDataType(testData)).toBe('GYearMonth');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            '2004-11',  // Valid
            '1998-2',   // Valid
            '2000-01',  // Valid
            '2100-12'   // Year 2100 (one year after valid range)
        ];
        expect(guessDataType(testData)).not.toBe('GYearMonth');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            '2004-11',  // Valid
            '1998-2',   // Valid
            '1899-06',  // Year 1899 (one year before valid range)
            '2000-01',  // Valid
        ];
        expect(guessDataType(testData)).not.toBe('GYearMonth');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            '1800-01',      // Year too early (18xx)
            '2200-12',      // Year too late (22xx)
            '1899-06',      // Year before valid range
            '2100-01',      // Year after valid range
            '2000-0',       // Month 0 (invalid)
            '2000-13',      // Month 13 (invalid)
            '2000-00',      // Month 00 (invalid)
            '199-06',       // 3-digit year (invalid length)
            '20000-01',     // 5-digit year (invalid length)
            'abc-def',      // Non-numeric
            '',             // Empty string
            '2000/06',      // Wrong separator (slash instead of hyphen)
            '2000 06',      // Space instead of hyphen
            '2000-123'      // Wrong format (3-digit month)
        ];
        expect(guessDataType(testData)).not.toBe('GYearMonth');
    });

    test('invalid data - out of range years', () => {
        const testData = [
            '1899-06',  // Year before 1900
            '2100-12',  // Year after 2099
            '1800-01',  // Year 18xx
            '2200-12'   // Year 22xx
        ];
        expect(guessDataType(testData)).not.toBe('GYearMonth');
    });

    test('invalid data - out of range months', () => {
        const testData = [
            '2000-0',   // Month 0
            '2000-13',  // Month 13
            '2000-14',  // Month 14
            '2000-99'   // Month 99
        ];
        expect(guessDataType(testData)).not.toBe('GYearMonth');
    });
});
