import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// Year
describe('test utils guessDataType: Year', () => {
    test('valid data - standard years', () => {
        const testData = [
            '1900',
            '1999',
            '2000',
            '2025',
            '2099'
        ];
        expect(guessDataType(testData)).toBe('Year');
    });

    test('valid data - edge cases', () => {
        const testData = [
            '1900',  // Minimum valid 4-digit year
            '2099',  // Maximum valid 4-digit year
            '2000',  // Century boundary
            '1999',  // Pre-century boundary
            '2001',  // Post-century boundary
            '99',    // 2-digit year (only valid with 4-digit years present)
            '05',    // 2-digit year with leading zero
            '00',    // 2-digit year (year 2000)
            12,      // Numeric 2-digit year
            '2024'   // Current year range
        ];
        expect(guessDataType(testData)).toBe('Year');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            '1899',  // One year before valid range
            '2100',  // One year after valid range
            '1999',
            '2000',
            '2025'
        ];
        expect(guessDataType(testData)).not.toBe('Year');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            '1800',      // Too early
            '2200',      // Too late
            '1899',      // Before valid range
            '2100',      // After valid range
            '199',       // 3 digits (invalid length)
            '20000',     // 5 digits (invalid length)
            'abc',       // Non-numeric
            '',          // Empty string
            '19-99',     // Contains hyphen
            '20 25'      // Contains space
        ];
        expect(guessDataType(testData)).not.toBe('Year');
    });

    test('invalid data - 2-digit only without 4-digit year', () => {
        // 2-digit years alone should not be recognized as Year
        // (they would be recognized as UnsignedByte or other numeric types)
        const testData = [
            '10',
            '12',
            '32',
            '99',
            '05'
        ];
        expect(guessDataType(testData)).not.toBe('Year');
    });

    test('invalid data - wrong century prefix', () => {
        const testData = [
            '1800',  // 18xx not valid
            '2100',  // 21xx not valid (only 19xx and 20xx)
            '1700',  // 17xx not valid
            '2200'   // 22xx not valid
        ];
        expect(guessDataType(testData)).not.toBe('Year');
    });

    test('valid data - mixed 4-digit and 2-digit years', () => {
        const testData = [
            '2000',  // 4-digit year (required for Year detection)
            '99',    // 2-digit year
            '2005',  // 4-digit year
            '05',    // 2-digit year
            '12'     // 2-digit year
        ];
        expect(guessDataType(testData)).toBe('Year');
    });
});