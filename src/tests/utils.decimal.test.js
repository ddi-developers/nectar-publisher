import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// Decimal
// Decimal numbers (with dot or comma as separator).
describe('test utils guessDataType: Decimal', () => {
    test('valid data - standard decimal values', () => {
        const testData = [
            -1.2,
            0.7,
            '0.1',
            '-65535.543',
            4294966295.012938
        ];
        expect(guessDataType(testData)).toBe('Decimal');
    });

    test('valid data - edge cases', () => {
        const testData = [
            0,                          // Zero (can be decimal)
            '0',                        // String zero
            "0.1",                      // Double quoted decimal
            "0,1",                      // Comma separator
            -1.2,                       // Negative decimal
            0.7,                        // Positive decimal
            '.5',                       // Leading dot
            ',5',                       // Leading comma
            '0.0',                      // Zero decimal
            '0,0'                       // Zero decimal with comma
        ];
        expect(guessDataType(testData)).toBe('Decimal');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            -1.2,
            0.7,
            '0.1',
            '1e5'                      // Scientific notation (should be Double)
        ];
        expect(guessDataType(testData)).not.toBe('Decimal');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            '1e5',                     // Scientific notation
            '1E5',                     // Scientific notation uppercase
            'abc',                     // Non-numeric
            '',                        // Empty string
            '1.2.3',                  // Multiple dots
            '1,2,3',                  // Multiple commas
            '1.2e5',                  // Decimal with scientific notation
            'INF'                     // Infinity
        ];
        expect(guessDataType(testData)).not.toBe('Decimal');
    });
});
