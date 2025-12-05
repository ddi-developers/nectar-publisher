import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// UnsignedLong
// Whole numbers in the range 0 - 18446744073709551615.
describe('test utils guessDataType: UnsignedLong', () => {
    test('valid data - standard unsigned long values', () => {
        const testData = [
            0,
            1000,
            Number.MAX_SAFE_INTEGER
        ];
        expect(guessDataType(testData)).toBe('UnsignedLong');
    });

    test('valid data - edge cases', () => {
        const testData = [
            0,                          // Minimum value
            Number.MAX_SAFE_INTEGER,    // Maximum safe integer
            '0',                        // String zero
            String(Number.MAX_SAFE_INTEGER), // String maximum
            "0",                        // Double quoted zero
            1,                          // Minimum positive
            4294967295,                 // 32-bit max
            '4294967295'                // String 32-bit max
        ];
        expect(guessDataType(testData)).toBe('UnsignedLong');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            0,
            1000,
            Number.MAX_SAFE_INTEGER + 1  // One over maximum safe integer
        ];
        expect(guessDataType(testData)).not.toBe('UnsignedLong');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            -1,                         // Negative
            Number.MAX_SAFE_INTEGER + 1, // Over maximum
            -2147483648,                // Negative int range
            'abc',                      // Non-numeric
            '',                         // Empty string
            1.5,                        // Decimal
            '-1'                        // String negative
        ];
        expect(guessDataType(testData)).not.toBe('UnsignedLong');
    });
});
