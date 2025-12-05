import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// Date
// Integer-valued year, month and day.
describe('test utils guessDataType: Date', () => {
    test('valid data - standard date values', () => {
        const now = new Date();
        const testData = [
            now,
            '2000-01-01',
            '2003-06-30'
        ];
        expect(guessDataType(testData)).toBe('Date');
    });

    test('valid data - edge cases', () => {
        const now = new Date();
        const testData = [
            now,                        // Date object
            '1900-01-01',              // Minimum year
            '2099-12-31',              // Maximum year
            '2000-01-01',              // First day of year
            '2000-12-31',              // Last day of year
            '2000-01-31',              // Last day of January
            '2000-02-29',              // Leap year day
            '2000-06-15',              // Mid-year
            '2000-01-01-05:00'         // With timezone offset
        ];
        expect(guessDataType(testData)).toBe('Date');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            new Date(),
            '2000-01-01',
            '2000-01-01 00:00'         // Has time (should be DateTime)
        ];
        expect(guessDataType(testData)).not.toBe('Date');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            '1899-01-01',              // Year before 1900
            '2100-01-01',              // Year after 2099
            '2000-13-01',               // Invalid month
            '2000-01-32',              // Invalid day
            '2000-00-01',               // Month 0
            '2000-01-00',               // Day 0
            '2000-01-01T00:00:00',     // Has time (should be DateTime)
            '01-01-2000',              // Wrong format
            '2000/01/01',              // Wrong separator
            'abc',                     // Non-numeric
            ''                         // Empty string
        ];
        expect(guessDataType(testData)).not.toBe('Date');
    });
});
