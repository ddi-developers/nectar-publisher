import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// NonNegativeInteger
// Whole numbers from 0 and greater.
describe('test utils guessDataType: NonNegativeInteger', () => {
    test('valid data - standard non-negative integer values', () => {
        const testData = [
            0,
            1,
            100,
            Number.MAX_SAFE_INTEGER + 1
        ];
        expect(guessDataType(testData)).toBe('NonNegativeInteger');
    });

    test('valid data - edge cases', () => {
        const testData = [
            0,                          // Minimum value (zero)
            Number.MAX_SAFE_INTEGER + 1, // Large value
            '0',                        // String zero
            '1',                        // String one
            "0",                        // Double quoted zero
            1,                          // Small positive
            4294967295,                 // 32-bit max
            '4294967295'                // String 32-bit max
        ];
        expect(guessDataType(testData)).toBe('NonNegativeInteger');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            0,
            1,
            100,
            -1                          // Negative (not non-negative)
        ];
        expect(guessDataType(testData)).not.toBe('NonNegativeInteger');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            -1,                         // Negative
            -100,                       // Negative
            1.5,                        // Decimal
            '-1',                       // String negative
            'abc',                      // Non-numeric
            ''                          // Empty string
        ];
        expect(guessDataType(testData)).not.toBe('NonNegativeInteger');
    });
});
