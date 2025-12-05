import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// PositiveInteger
// Whole numbers from 1 and greater.
describe('test utils guessDataType: PositiveInteger', () => {
    test('valid data - standard positive integer values', () => {
        const testData = [
            1,
            100,
            1000,
            Number.MAX_SAFE_INTEGER + 1
        ];
        expect(guessDataType(testData)).toBe('PositiveInteger');
    });

    test('valid data - edge cases', () => {
        const testData = [
            1,                          // Minimum value
            Number.MAX_SAFE_INTEGER + 1, // Large value
            '1',                        // String one
            '65535',                    // String value
            "1",                        // Double quoted one
            2,                          // Small positive
            4294967295,                 // 32-bit max
            '4294967295'                // String 32-bit max
        ];
        expect(guessDataType(testData)).toBe('PositiveInteger');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            1,
            100,
            0                           // Zero (not positive)
        ];
        expect(guessDataType(testData)).not.toBe('PositiveInteger');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            0,                          // Zero
            -1,                         // Negative
            -100,                       // Negative
            1.5,                        // Decimal
            '0',                        // String zero
            '-1',                       // String negative
            'abc',                      // Non-numeric
            ''                          // Empty string
        ];
        expect(guessDataType(testData)).not.toBe('PositiveInteger');
    });
});
