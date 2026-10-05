import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// Duration
describe('test utils guessDataType: Duration', () => {
    test('valid data - standard durations', () => {
        const testData = [
            'P1Y2M3DT10H30M',           // 1 year, 2 months, 3 days, 10 hours, 30 minutes
            'P1Y',                       // 1 year
            'P2M',                       // 2 months
            'P3D',                       // 3 days
            'PT10H',                     // 10 hours
            'PT30M',                     // 30 minutes
            'PT45S'                      // 45 seconds
        ];
        expect(guessDataType(testData)).toBe('Duration');
    });

    test('valid data - edge cases', () => {
        const testData = [
            'P0Y',                       // Zero duration
            'PT0S',                      // Zero seconds
            'P1Y2M3DT4H5M6S',           // All components
            'PT0.5S',                    // Decimal seconds
            'PT1.234567S',               // Arbitrary precision seconds
            '-P120D',                    // Negative duration
            '-P1Y2M3DT4H5M6.789S',      // Negative with all components and decimals
            'P100Y',                     // Large year value
            'PT999999H',                 // Very large hour value
            'P1DT1S'                     // Day and seconds only (no hours/minutes)
        ];
        expect(guessDataType(testData)).toBe('Duration');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            'P1Y2M3DT10H30M',
            'P5D',
            'PT2H30M',
            'P1Y6M',
            'P1Y2M3DT10H30'             // Missing 'M' at end - close but invalid
        ];
        expect(guessDataType(testData)).not.toBe('Duration');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            '1Y2M3D',                    // Missing 'P' prefix
            'P1Y2M3D10H30M',            // Missing 'T' separator
            'PT',                        // Only 'PT' without values
            'P',                         // Only 'P' without values
            'P1Y2M3DT',                 // 'T' but no time components
            ''                           // Empty string
        ];
        expect(guessDataType(testData)).not.toBe('Duration');
    });

    test('invalid data - mixed valid and invalid', () => {
        const testData = [
            'P1Y2M',                     // Valid
            'P1H30M',                    // Invalid (missing T before time)
            'PT5H',                      // Valid
            '2Y3M',                      // Invalid (missing P)
            '-P10D'                      // Valid
        ];
        expect(guessDataType(testData)).not.toBe('Duration');
    });

    test('invalid data - wrong order or format', () => {
        const testData = [
            'P1D2M3Y',                   // Wrong order (should be Y, M, D)
            'PT1S2M3H',                  // Wrong order (should be H, M, S)
            'P1Y2M3DT4H5M6.S',          // Decimal point without digits
            'P1.5Y',                     // Decimal not allowed for years
            'P1Y2.5M',                   // Decimal not allowed for months
            'P1.5D'                      // Decimal not allowed for days
        ];
        expect(guessDataType(testData)).not.toBe('Duration');
    });

    test('invalid data - invalid characters', () => {
        const testData = [
            'P1Y 2M',                    // Contains space
            'P1Y2M3D T10H',             // Space before T
            'P1y2m3d',                   // Lowercase designators
            'P1Year2Months',             // Full words instead of designators
            'P1Y2M3DT10H30M45S.',       // Trailing period
            'P+1Y'                       // Plus sign (only minus allowed)
        ];
        expect(guessDataType(testData)).not.toBe('Duration');
    });

    test('valid data - decimal seconds without separate capture groups', () => {
        const testData = [
            'PT0.5S',                    // Half second
            'PT1.234S',                  // Millisecond precision
            'PT10.123456789S',           // Nanosecond precision
            'P1DT2H3M4.5S',             // Full duration with decimal seconds
            '-PT0.001S'                  // Negative with decimal seconds
        ];
        expect(guessDataType(testData)).toBe('Duration');
    });

    test('valid data - empty duration (edge case)', () => {
        const testData = [
            'PT0S',                      // Zero seconds is valid
            'P0D',                       // Zero days is valid
            'P0Y0M0DT0H0M0S'            // All zeros (technically valid ISO 8601)
        ];
        expect(guessDataType(testData)).toBe('Duration');
    });

    test('invalid data - completely empty duration', () => {
        const testData = [
            'P',                         // Just P with no components
            'PT',                        // Just PT with no time components
            '-P',                        // Negative sign but no components
            '-PT'                        // Negative with T but no components
        ];
        expect(guessDataType(testData)).not.toBe('Duration');
    });

    test('invalid data - T without any time components', () => {
        const testData = [
            'P1Y2M3DT',                  // Date parts OK, but T with nothing after
            'P5DT',                      // Day specified, but T with nothing after
            '-P10YT'                     // Negative, year specified, but T with nothing
        ];
        expect(guessDataType(testData)).not.toBe('Duration');
    });
});
