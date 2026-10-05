import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// Time
// Left-truncated dateTime, e.g., 13:20:00-05:00.
describe('test utils guessDataType: Time', () => {
    test('valid data - standard time values', () => {
        const now = new Date();
        const testData = [
            now,
            '17:05',
            '13:20:00-05:00',
            '1:20pm'
        ];
        expect(guessDataType(testData)).toBe('Time');
    });

    test('valid data - edge cases', () => {
        const now = new Date();
        const testData = [
            now,                        // Date object
            '00:00:00',                 // Midnight
            '23:59:59',                 // End of day
            '12:00:00',                 // Noon
            '1:20pm',                   // 12-hour format with pm
            '1:20am',                   // 12-hour format with am
            '1:20 p.m.',                // 12-hour format with dots
            '13:20:00-05:00',           // With timezone
            '13:20:00+05:00',           // With positive timezone
            '13:20:00.123',             // With milliseconds
            '13:20:00.123-05:00',       // Milliseconds with timezone
            '1:20',                     // Without seconds
            '13:20'                     // 24-hour format without seconds
        ];
        expect(guessDataType(testData)).toBe('Time');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            new Date(),
            '17:05',
            '25:00'                     // Invalid hour 25
        ];
        expect(guessDataType(testData)).not.toBe('Time');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            '25:00:00',                 // Invalid hour
            '12:60:00',                 // Invalid minute
            '12:00:60',                 // Invalid second
            '2000-01-01T00:00:00',     // Has date (should be DateTime)
            '2000-01-01',              // Has date only (should be Date)
            'abc',                      // Non-numeric
            '',                         // Empty string
            '12:00:00:00',              // Too many components
            '1:2:3:4'                   // Too many components
        ];
        expect(guessDataType(testData)).not.toBe('Time');
    });
});
