import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// Boolean
describe('test utils guessDataType: Boolean', () => {
    test('valid data - standard boolean values', () => {
        const testData = [
            'true',
            'false',
            '1',
            '0',
            true,
            false,
            1,
            0
        ];
        expect(guessDataType(testData)).toBe('Boolean');
    });

    test('valid data - edge cases', () => {
        const testData = [
            'TRUE',     // Uppercase
            'FALSE',    // Uppercase
            'True',     // Mixed case
            'False',    // Mixed case
            '1',        // String one
            '0',        // String zero
            1,          // Numeric one
            0,          // Numeric zero
            true,       // Boolean true
            false       // Boolean false
        ];
        expect(guessDataType(testData)).toBe('Boolean');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            'true',
            'false',
            '1',
            '0',
            'yes'       // Close but not valid boolean
        ];
        expect(guessDataType(testData)).not.toBe('Boolean');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            'yes',
            'no',
            'on',
            'off',
            'Y',
            'N',
            '2',
            '-1',
            '',
            'tru',
            'fals'
        ];
        expect(guessDataType(testData)).not.toBe('Boolean');
    });
});
