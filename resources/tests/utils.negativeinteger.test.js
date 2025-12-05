import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// NegativeInteger
// Whole numbers from -1 and less.
describe('test utils guessDataType: NegativeInteger', () => {
    test('valid data - standard negative integer values', () => {
        const testData = [
            -1,
            -100,
            -1000,
            Number.MIN_SAFE_INTEGER
        ];
        expect(guessDataType(testData)).toBe('NegativeInteger');
    });

    test('valid data - edge cases', () => {
        const testData = [
            -1,                         // Minimum value (most positive negative)
            Number.MIN_SAFE_INTEGER,    // Maximum negative
            '-1',                       // String negative one
            '-65535',                   // String negative
            "-1",                       // Double quoted negative one
            -2,                         // Small negative
            -4294967295,                // Large negative
            '-4294967295'               // String large negative
        ];
        expect(guessDataType(testData)).toBe('NegativeInteger');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            -1,
            -100,
            0                           // Zero (not negative)
        ];
        expect(guessDataType(testData)).not.toBe('NegativeInteger');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            0,                          // Zero
            1,                          // Positive
            100,                        // Positive
            -1.5,                       // Decimal negative
            '0',                        // String zero
            '1',                        // String positive
            'abc',                      // Non-numeric
            ''                          // Empty string
        ];
        expect(guessDataType(testData)).not.toBe('NegativeInteger');
    });
});
