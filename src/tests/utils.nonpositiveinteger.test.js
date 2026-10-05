import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// NonPositiveInteger
// Whole numbers from 0 and less.
describe('test utils guessDataType: NonPositiveInteger', () => {
    test('valid data - standard non-positive integer values', () => {
        const testData = [
            0,
            -1,
            -100,
            Number.MIN_SAFE_INTEGER
        ];
        expect(guessDataType(testData)).toBe('NonPositiveInteger');
    });

    test('valid data - edge cases', () => {
        const testData = [
            0,                          // Maximum value (zero)
            Number.MIN_SAFE_INTEGER,    // Minimum negative
            '0',                        // String zero
            '-1',                       // String negative one
            "0",                        // Double quoted zero
            -1,                         // Small negative
            -4294967295,                // Large negative
            '-4294967295'               // String large negative
        ];
        expect(guessDataType(testData)).toBe('NonPositiveInteger');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            0,
            -1,
            -100,
            1                           // Positive (not non-positive)
        ];
        expect(guessDataType(testData)).not.toBe('NonPositiveInteger');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            1,                          // Positive
            100,                        // Positive
            -1.5,                       // Decimal negative
            '1',                        // String positive
            'abc',                      // Non-numeric
            ''                          // Empty string
        ];
        expect(guessDataType(testData)).not.toBe('NonPositiveInteger');
    });
});
