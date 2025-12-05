import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// MonthDay
describe('test utils guessDataType: GMonthDay', () => {
    test('valid data - standard month-day combinations', () => {
        const testData = [
            '01-01',  // January 1st
            '06-15',  // June 15th
            '12-31',  // December 31st
            '03-20',  // March 20th
            '09-30'   // September 30th
        ];
        expect(guessDataType(testData)).toBe('GMonthDay');
    });

    test('valid data - edge cases', () => {
        const testData = [
            '1-1',    // Minimum month and day (single digit)
            '12-31',  // Maximum month and day
            '01-31',  // First month, last day
            '12-01',  // Last month, first day
            '2-22',   // Single digit month, double digit day
            '11-2',   // Double digit month, single digit day
            '4-5',    // Both single digits
            '06-30',  // Month with leading zero, day without
            '9-15'    // Month without leading zero, day with
        ];
        expect(guessDataType(testData)).toBe('GMonthDay');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            '12-31',  // Valid
            '01-01',  // Valid
            '06-20',  // Valid
            '11-32'   // Day 32 (one too many)
        ];
        expect(guessDataType(testData)).not.toBe('GMonthDay');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            '12-31',  // Valid
            '01-01',  // Valid
            '13-15',  // Month 13 (one too many)
            '06-20',  // Valid
        ];
        expect(guessDataType(testData)).not.toBe('GMonthDay');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            '0-1',      // Month 0 (invalid)
            '13-1',     // Month 13 (invalid)
            '1-0',      // Day 0 (invalid)
            '1-32',     // Day 32 (invalid)
            '00-15',    // Month 00 (invalid)
            '12-00',    // Day 00 (invalid)
            'abc-def',  // Non-numeric
            '',         // Empty string
            '12/31',    // Wrong separator (slash instead of hyphen)
            '12 31',    // Space instead of hyphen
            '123-45',   // Wrong format (3-digit month)
            '12-345'    // Wrong format (3-digit day)
        ];
        expect(guessDataType(testData)).not.toBe('GMonthDay');
    });

    test('invalid data - out of range months', () => {
        const testData = [
            '0-15',     // Month 0
            '13-15',    // Month 13
            '14-20',    // Month 14
            '99-01'     // Month 99
        ];
        expect(guessDataType(testData)).not.toBe('GMonthDay');
    });

    test('invalid data - out of range days', () => {
        const testData = [
            '01-0',     // Day 0
            '06-32',    // Day 32
            '12-99',    // Day 99
            '03-100'    // Day 100
        ];
        expect(guessDataType(testData)).not.toBe('GMonthDay');
    });
});