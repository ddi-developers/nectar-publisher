import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// UnsignedByte
// Whole numbers in the range 0 - 255.
describe('test utils guessDataType: UnsignedByte', () => {
    test('valid data - standard unsigned byte values', () => {
        const testData = [
            0,
            1,
            100,
            200,
            255
        ];
        expect(guessDataType(testData)).toBe('UnsignedByte');
    });

    test('valid data - edge cases', () => {
        const testData = [
            0,          // Minimum value
            255,        // Maximum value
            '0',        // String zero
            '255',      // String maximum
            "0",        // Double quoted zero
            "255",      // Double quoted maximum
            1,          // Minimum positive
            128,        // Middle value
            '128'       // String middle value
        ];
        expect(guessDataType(testData)).toBe('UnsignedByte');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            0,
            100,
            200,
            256         // One over maximum
        ];
        expect(guessDataType(testData)).not.toBe('UnsignedByte');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            -1,         // Negative
            256,        // Over maximum
            1000,       // Way over maximum
            -128,       // Negative byte range
            'abc',      // Non-numeric
            '',         // Empty string
            1.5,        // Decimal
            '256'       // String over maximum
        ];
        expect(guessDataType(testData)).not.toBe('UnsignedByte');
    });
});
