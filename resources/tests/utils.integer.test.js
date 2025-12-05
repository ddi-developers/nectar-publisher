import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// Integer
// Whole numbers (positive, negative, or zero).
describe('test utils guessDataType: Integer', () => {
    test('valid data - standard integer values', () => {
        const testData = [
            -100,
            0,
            100,
            Number.MIN_SAFE_INTEGER,
            Number.MAX_SAFE_INTEGER
        ];
        expect(guessDataType(testData)).toBe('Integer');
    });

    test('valid data - edge cases', () => {
        const testData = [
            Number.MIN_SAFE_INTEGER,    // Minimum
            Number.MAX_SAFE_INTEGER,     // Maximum
            '0',                        // String zero
            '-1',                       // String negative
            "1",                        // Double quoted positive
            -1,                         // Small negative
            1,                          // Small positive
            0,                          // Zero
            '-4294967295',              // String large negative
            '4294967295'                // String large positive
        ];
        expect(guessDataType(testData)).toBe('Integer');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            -1,
            0,
            100,
            1.1                         // Decimal (not integer)
        ];
        expect(guessDataType(testData)).not.toBe('Integer');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            1.5,                        // Decimal
            2.34,                       // Decimal
            -1.2,                       // Decimal negative
            '1.5',                      // String decimal
            'abc',                      // Non-numeric
            ''                          // Empty string
        ];
        expect(guessDataType(testData)).not.toBe('Integer');
    });
});
