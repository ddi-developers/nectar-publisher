import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// Base64Binary
describe('test utils guessDataType: Base64Binary', () => {
    test('valid data - standard base64 sequences', () => {
        const testData = [
            'SGVsbG8=',              // "Hello" in base64
            'V29ybGQ=',              // "World" in base64
            'QUJDRA==',              // "ABCD" in base64
            'YWJjZGVmZ2g=',          // "abcdefgh" in base64
            'MTIzNDU2Nzg5MA=='      // "1234567890" in base64
        ];
        expect(guessDataType(testData)).toBe('Base64Binary');
    });

    test('valid data - edge cases', () => {
        const testData = [
            'AAAA',                  // Minimum valid (4 chars, no padding)
            'AAAAAAAAAAAAAAAA',      // Long sequence without padding
            'AAA=',                  // With one padding
            'AA==',                  // With two padding
            'aAbB',                  // Mixed case
            '////',                  // All slashes
            '++++',                  // All plus signs
            '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/'  // All valid chars
        ];
        expect(guessDataType(testData)).toBe('Base64Binary');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            'SGVsbG8=',
            'V29ybGQ=',
            'QUJDRA==',
            'YWJjZGVmZ2g=',
            'ABC'                    // Length not multiple of 4 - close but invalid
        ];
        expect(guessDataType(testData)).not.toBe('Base64Binary');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            'ABC',                   // Length 3 (not multiple of 4)
            'ABCDE',                 // Length 5 (not multiple of 4)
            'ABC@',                  // Invalid character @
            'AB$D',                  // Invalid character $
            'A B C D',               // Contains spaces
            ''                       // Empty string
        ];
        expect(guessDataType(testData)).not.toBe('Base64Binary');
    });

    test('invalid data - mixed valid and invalid', () => {
        const testData = [
            'SGVsbG8=',              // Valid
            'ABCDE',                 // Invalid (length 5)
            'V29ybGQ=',              // Valid
            'TEST!',                 // Invalid (bad char)
            'QUJDRA=='               // Valid
        ];
        expect(guessDataType(testData)).not.toBe('Base64Binary');
    });

    test('invalid data - padding in wrong positions', () => {
        const testData = [
            'A=BC',                  // Padding not at end
            '=ABC',                  // Padding at start
            'AB=C',                  // Padding in middle
            'A===',                  // Too many padding chars
            'AAA=='                  // Invalid padding (should be single =)
        ];
        expect(guessDataType(testData)).not.toBe('Base64Binary');
    });
});
