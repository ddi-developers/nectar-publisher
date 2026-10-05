import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// DateTime
// Integer-valued year, month, day, and time zone hour and minutes.
describe('test utils guessDataType: DateTime', () => {
    test('valid data - standard datetime values', () => {
        const now = new Date();
        const testData = [
            now,
            '2000-01-01 00:00',
            '2003-06-30 12:30:45',
            '2025-12-31T23:59:59'
        ];
        expect(guessDataType(testData)).toBe('DateTime');
    });

    test('valid data - edge cases', () => {
        const now = new Date();
        const testData = [
            now,                        // Date object
            '1900-01-01T00:00:00',     // Minimum year
            '2099-12-31T23:59:59',     // Maximum year
            '2000-01-01 00:00',        // Space separator
            '2000-01-01T00:00',        // T separator
            '2000-01-01T00:00:00Z',    // UTC timezone
            '2000-01-01T00:00:00+05:00', // Positive timezone
            '2000-01-01T00:00:00-05:00', // Negative timezone
            '2000-01-01T00:00:00.123',  // With milliseconds
            '2000-01-01T00:00:00.123Z'   // Milliseconds with UTC
        ];
        expect(guessDataType(testData)).toBe('DateTime');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            new Date(),
            '2000-01-01 00:00',
            '2000-13-01 00:00'          // Invalid month 13
        ];
        expect(guessDataType(testData)).not.toBe('DateTime');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            '1899-01-01T00:00:00',      // Year before 1900
            '2100-01-01T00:00:00',      // Year after 2099
            '2000-13-01T00:00:00',      // Invalid month
            '2000-01-32T00:00:00',      // Invalid day
            '2000-01-01T25:00:00',      // Invalid hour
            '2000-01-01T00:60:00',      // Invalid minute
            '2000-01-01',               // Missing time (should be Date)
            '00:00:00',                 // Missing date (should be Time)
            'abc',                      // Non-numeric
            ''                          // Empty string
        ];
        expect(guessDataType(testData)).not.toBe('DateTime');
    });
});
