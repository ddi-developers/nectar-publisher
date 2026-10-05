import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// Short
// Whole numbers in the range -32768 - 32767.
describe('test utils guessDataType: Short', () => {
    test('valid data - standard short values', () => {
        const testData = [
            -32768,
            -128,
            0,
            128,
            32767
        ];
        expect(guessDataType(testData)).toBe('Short');
    });

    test('valid data - edge cases', () => {
        const testData = [
            -32768,     // Minimum value
            32767,      // Maximum value
            '-32768',   // String minimum
            '32767',    // String maximum
            "-128",     // Double quoted negative
            "0",        // Double quoted zero
            -1,         // Negative one
            1,          // Positive one
            0,          // Zero
            '0'         // String zero
        ];
        expect(guessDataType(testData)).toBe('Short');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            -32768,
            0,
            10000,
            32768      // One over maximum
        ];
        expect(guessDataType(testData)).not.toBe('Short');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            -32769,     // Under minimum
            32768,      // Over maximum
            100000,     // Way over maximum
            -100000,    // Way under minimum
            'abc',      // Non-numeric
            '',         // Empty string
            1.5,        // Decimal
            '32768'     // String over maximum
        ];
        expect(guessDataType(testData)).not.toBe('Short');
    });
});
