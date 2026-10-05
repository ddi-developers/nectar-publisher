import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// UnsignedShort
// Whole numbers in the range 0 - 65535.
describe('test utils guessDataType: UnsignedShort', () => {
    test('valid data - standard unsigned short values', () => {
        const testData = [
            0,
            1000,
            32000,
            65535
        ];
        expect(guessDataType(testData)).toBe('UnsignedShort');
    });

    test('valid data - edge cases', () => {
        const testData = [
            0,          // Minimum value
            65535,      // Maximum value
            '0',        // String zero
            '65535',    // String maximum
            "0",        // Double quoted zero
            "65535",    // Double quoted maximum
            1,          // Minimum positive
            32767,      // Middle value
            '32767'     // String middle value
        ];
        expect(guessDataType(testData)).toBe('UnsignedShort');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            0,
            1000,
            32000,
            65536       // One over maximum
        ];
        expect(guessDataType(testData)).not.toBe('UnsignedShort');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            -1,         // Negative
            65536,      // Over maximum
            100000,     // Way over maximum
            -32768,     // Negative short range
            'abc',      // Non-numeric
            '',         // Empty string
            1.5,        // Decimal
            '65536'     // String over maximum
        ];
        expect(guessDataType(testData)).not.toBe('UnsignedShort');
    });
});
