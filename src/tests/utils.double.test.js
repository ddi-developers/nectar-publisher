import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// Double
// Double numbers with scientific notation support.
describe('test utils guessDataType: Double', () => {
    test('valid data - standard double values', () => {
        const testData = [
            -1.2e2,
            0.7,
            '0.1',
            '-65535.543e7',
            4294966295.01293,
            8e-5
        ];
        expect(guessDataType(testData)).toBe('Double');
    });

    test('valid data - edge cases', () => {
        const testData = [
            '0',                        // Zero
            "0.1",                      // Simple decimal
            "0,1e-9",                   // Comma with scientific notation
            '-65535,543',               // Comma separator
            -4290067295.954838e2,       // Large number with scientific notation
            'INF',                      // Infinity
            '- INF',                    // Negative infinity with space
            '123e5',                    // Integer with scientific notation
            '123E5',                    // Uppercase E
            '123.45e-5',                // Decimal with negative exponent
            '123,45E5'                  // Comma with uppercase E
        ];
        expect(guessDataType(testData)).toBe('Double');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            -1.2e2,
            0.7,
            '0.1',
            '1.2.3'                     // Multiple dots (invalid)
        ];
        expect(guessDataType(testData)).not.toBe('Double');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            'abc',                      // Non-numeric
            '',                         // Empty string
            '1.2.3',                    // Multiple dots
            '1,2,3',                   // Multiple commas
            'e5',                      // Just exponent
            'E5',                      // Just exponent uppercase
            '1e',                      // Incomplete exponent
            '1E',                      // Incomplete exponent uppercase
            '1.2e',                    // Decimal with incomplete exponent
            'NaN'                      // Not a number
        ];
        expect(guessDataType(testData)).not.toBe('Double');
    });
});
