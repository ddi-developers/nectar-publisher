import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// UnsignedInt
// Whole numbers in the range 0 - 4294967295.
describe('test utils guessDataType: UnsignedInt', () => {
    test('valid data - standard unsigned int values', () => {
        const testData = [
            0,
            1000,
            4294967295
        ];
        expect(guessDataType(testData)).toBe('UnsignedInt');
    });

    test('valid data - edge cases', () => {
        const testData = [
            0,                  // Minimum value
            4294967295,        // Maximum value
            '0',               // String zero
            '4294967295',      // String maximum
            "0",               // Double quoted zero
            "4294967295",      // Double quoted maximum
            1,                 // Minimum positive
            2147483647,        // Middle value
            '2147483647'       // String middle value
        ];
        expect(guessDataType(testData)).toBe('UnsignedInt');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            0,
            1000,
            4294967296         // One over maximum
        ];
        expect(guessDataType(testData)).not.toBe('UnsignedInt');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            -1,                 // Negative
            4294967296,         // Over maximum
            9999999999,         // Way over maximum
            -2147483648,        // Negative int range
            'abc',              // Non-numeric
            '',                 // Empty string
            1.5,                // Decimal
            '4294967296'        // String over maximum
        ];
        expect(guessDataType(testData)).not.toBe('UnsignedInt');
    });
});
