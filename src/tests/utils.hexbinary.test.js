import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// HexBinary
describe('test utils guessDataType: HexBinary', () => {
    test('valid data - standard hex sequences', () => {
        const testData = [
            'DEADBEEF',
            '48656C6C6F',
            'A1B2C3D4',
            'FF00FF00',
            '0123456789ABCDEF'
        ];
        expect(guessDataType(testData)).toBe('HexBinary');
    });

    test('valid data - edge cases', () => {
        const testData = [
            '00',                    // Minimum valid (1 byte)
            'FFFFFFFFFFFFFFFF',      // Long sequence
            'aabbccdd',              // Lowercase
            'AaBbCcDd',              // Mixed case
            '00000000',              // All zeros
            'FFFFFFFF'               // All Fs
        ];
        expect(guessDataType(testData)).toBe('HexBinary');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            'DEADBEEF',
            '48656C6C6F',
            'A1B2C3D4',
            'FF00FF00',
            'ABCDE'                  // Odd length - close but invalid
        ];
        expect(guessDataType(testData)).not.toBe('HexBinary');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            'GHIJKLMN',              // Invalid characters
            '123',                   // Odd length
            'XYZ123',                // Invalid chars + odd length
            '12 34 56',              // Contains spaces
            'DEADBEEFG',             // Valid start, invalid end
            ''                       // Empty string
        ];
        expect(guessDataType(testData)).not.toBe('HexBinary');
    });

    test('invalid data - mixed valid and invalid', () => {
        const testData = [
            'DEADBEEF',              // Valid
            'A1B2C3',                // Invalid (odd length)
            '48656C6C6F',            // Valid
            'NOTAHEX',               // Invalid (bad chars)
            'FF00FF00'               // Valid
        ];
        expect(guessDataType(testData)).not.toBe('HexBinary');
    });
});
