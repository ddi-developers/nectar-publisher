import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

test('test if vitest is running and working', () => {
    expect(true).toBe(true);
    expect(true).not.toBe(false);
});

test('test utils guessDataType: Boolean', () => {
    expect(guessDataType(['true', true, '1', 1, false, 0, '0', "0"])).toBe('Boolean');
});

// Unasigned byte
// Whole numbers in the range 0 - 255.
test('test utils guessDataType: UnsignedByte', () => {
    expect(guessDataType([0, '0', "0", 1, '1', "1", 2, 10, 100, 255, '255', "255"])).toBe('UnsignedByte');
    expect(guessDataType([10, 12, 32, 22, 99, 128])).toBe('UnsignedByte');
});

// Unsigned short
// Whole numbers in the range 0 - 65535.
test('test utils guessDataType: UnsignedShort', () => {
    expect(guessDataType([0, '0', "0", 1, '1', "1", 2, 10, 100, 255, '255', "255", 1000, 32000, '65535'])).toBe('UnsignedShort');
    expect(guessDataType([10, 112, 332, 22, 99, 65535])).toBe('UnsignedShort');
    expect(guessDataType([1200, 1112, 1332, 2022, 1999, 65535])).toBe('UnsignedShort');
});

// Unsigned int
// Whole numbers in the range 0 - 4294967295.
test('test utils guessDataType: UnsignedInt', () => {
    const testData = [0, '0', "0", 1, '1', "1", 2, 10, 100, 255, '255', "255", 1000, 32000, '65535', 4290067295, 4294966295, 4294967295];
    expect(guessDataType(testData)).toBe('UnsignedInt');
});

// Unsigned long
// Whole numbers in the range 0 - 18446744073709551615.
test('test utils guessDataType: UnsignedLong', () => {
    const testData = [0, '0', "0", 1, '1', "1", 2, 10, 100, 255, '255', "255", 1000, 32000, '65535', 4290067295, 4294966295, 4294967295, Number.MAX_SAFE_INTEGER];
    expect(guessDataType(testData)).toBe('UnsignedLong');
    expect(guessDataType([Number.MAX_SAFE_INTEGER])).toBe('UnsignedLong');
    expect(guessDataType([Number.MAX_SAFE_INTEGER + 1])).not.toBe('UnsignedLong');
});

// Byte
// Whole numbers in the range -128 - 127.
test('test utils guessDataType: Byte', () => {
    const testData = [-128, '-64', 0, '0', "0", 1, '1', "1", 2, 10, 100, 127];
    expect(guessDataType(testData)).toBe('Byte');
});

// Short
// Whole numbers in the range -32768 - 32767.
test('test utils guessDataType: Short', () => {
    const testData = [-32768, -16768, -128, '-64', 0, '0', "0", 1, '1', "1", 2, 10, 100, 127, 16786, 32767];
    expect(guessDataType(testData)).toBe('Short');
});

// PositiveInteger
// Whole numbers from 1 and greater than 18446744073709551615.
test('test utils guessDataType: PositiveInteger', () => {
    const testData = [1, '1', "1", '65535', 4290067295, 4294966295, Number.MAX_SAFE_INTEGER + 1];
    expect(guessDataType(testData)).toBe('PositiveInteger');
    expect(guessDataType([0, Number.MAX_SAFE_INTEGER])).not.toBe('PositiveInteger');
});

// NegativeInteger
// Whole numbers from -1 and less than -18446744073709551615.
test('test utils guessDataType: NegativeInteger', () => {
    const testData = [-1, '-1', "-1", '-65535', -4290067295, -4294966295, Number.MIN_SAFE_INTEGER];
    expect(guessDataType(testData)).toBe('NegativeInteger');
    expect(guessDataType([0, Number.MIN_SAFE_INTEGER])).not.toBe('NegativeInteger');
});

// NonNegativeInteger
// Whole numbers from 0 and greater than 18446744073709551615.
test('test utils guessDataType: NonNegativeInteger', () => {
    const testData = [0, '0', "0", '65535', 4290067295, 4294966295, Number.MAX_SAFE_INTEGER + 1];
    expect(guessDataType(testData)).toBe('NonNegativeInteger');
    expect(guessDataType([-1, Number.MAX_SAFE_INTEGER])).not.toBe('NonNegativeInteger');
});

// NonPositiveInteger
// Whole numbers from 0 and less than -18446744073709551615.
test('test utils guessDataType: NonPositiveInteger', () => {
    const testData = [0, '0', "0", '-65535', -4290067295, -4294966295, Number.MIN_SAFE_INTEGER];
    expect(guessDataType(testData)).toBe('NonPositiveInteger');
    expect(guessDataType([1, Number.MIN_SAFE_INTEGER])).not.toBe('NonPositiveInteger');
});

// Integer
// Whole numbers
test('test utils guessDataType: Integer', () => {
    const testData = [-1, 0, '0', "0", '-65535', -4290067295, 4294966295, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
    expect(guessDataType(testData)).toBe('Integer');
    expect(guessDataType([1.1, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER])).not.toBe('Integer');
});

// Decimal
// Decimal numbers
test('test utils guessDataType: Decimal', () => {
    let testData = [-1.2, 0.7, '0', "0.1", '-65535.543', -4290067295.954838, 4294966295.012938, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
    expect(guessDataType(testData)).toBe('Decimal');
    testData = [-1.2, 0.7, '0', "0,1", '-65535,543', -4290067295.954838, 4294966295.012938, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
    expect(guessDataType(testData)).toBe('Decimal');
    expect(guessDataType([1, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER])).not.toBe('Decimal');
});

// Double
// Double numbers
test('test utils guessDataType: Double', () => {
    let testData = [-1.2e2, 0.7, '0', "0.1", '-65535.543e7', -4290067295.954838, 4294966295.01293, 8e-5, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
    expect(guessDataType(testData)).toBe('Double');
    testData = [-1.2, 0.7, '0', "0,1e-9", '-65535,543', -4290067295.954838e2, 4294966295.012938, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
    expect(guessDataType(testData)).toBe('Double');
    expect(guessDataType([1, 2.34, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER])).not.toBe('Double');
});

// DateTime
// Integer-valued year, month, day, and time zone hour and minutes, e.g., 2003-06-30-05:00 (30 June 2003 Eastern Standard Time U.S.).
test('test utils guessDataType: DateTime', () => {
    const now = new Date();
    const testData = [now, '2000-01-01 00:00'];
    expect(guessDataType(testData)).toBe('DateTime');
});

// Date
// Integer-valued year, month and day, e.g., 2003-06-30 (30 June 2003 Eastern Standard Time U.S.).
test('test utils guessDataType: Date', () => {
    const now = new Date();
    const testData = ['2000-01-01', '2003-06-30', now];
    expect(guessDataType(testData)).toBe('Date');
});

// Time
// Left-truncated dateTime, e.g., 13:20:00-05:00 (1:20 pm for Eastern Standard Time U.S.).
test('test utils guessDataType: Time', () => {
    const now = new Date();
    const testData = ['17:05', '13:20:00-05:00', '1:20pm', now];
    expect(guessDataType(testData)).toBe('Time');
});

// YearMonth
// Integer-valued year and month, e.g., 2004-11.
test('test utils guessDataType: GYearMonth', () => {
    const testData = ['2004-11', '1998-2'];
    expect(guessDataType(testData)).toBe('GYearMonth');
});

// MonthDay
// Integer-valued month and day, e.g., 12-31.
test('test utils guessDataType: GMonthDay', () => {
    const testData = ['12-31', '04-10', '2-22', '11-2', '4-5'];
    expect(guessDataType(testData)).toBe('GMonthDay');
});

// Year
// Integer-valued year, e.g., 1999 or 2025.
test('test utils guessDataType: Year', () => {
    const testData = ['1900', '2025', '1999', '99', '05', '00', 12];
    expect(guessDataType(testData)).toBe('Year');
});
