import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// Byte
// Whole numbers in the range -128 - 127.
describe('test utils guessDataType: Byte', () => {
    test('valid data - standard byte values', () => {
        const testData = [
            -128,
            -64,
            0,
            64,
            127
        ];
        expect(guessDataType(testData)).toBe('Byte');
    });

    test('valid data - edge cases', () => {
        const testData = [
            -128,      // Minimum value
            127,       // Maximum value
            '-128',    // String minimum
            '127',     // String maximum
            "-64",     // Double quoted negative
            "0",       // Double quoted zero
            -1,        // Negative one
            1,         // Positive one
            0,         // Zero
            '0'        // String zero
        ];
        expect(guessDataType(testData)).toBe('Byte');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            -128,
            0,
            100,
            128        // One over maximum
        ];
        expect(guessDataType(testData)).not.toBe('Byte');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            -129,      // Under minimum
            128,       // Over maximum
            1000,      // Way over maximum
            -1000,     // Way under minimum
            'abc',     // Non-numeric
            '',        // Empty string
            1.5,       // Decimal
            '128'      // String over maximum
        ];
        expect(guessDataType(testData)).not.toBe('Byte');
    });
});
