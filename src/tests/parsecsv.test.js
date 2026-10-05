import { Parser } from '../modules/utils.js';
import { expect, describe, test } from 'vitest';
import csvText from './data/parsecsv-1.test.csv?raw';


describe('Parser', () => {
  describe('should read csv into javascript file object', async () => {
    // create a file object from the csv text
    const csvFile = new File([csvText], 'parsecsv-1.test.csv', { type: 'text/csv' });
    
    // parseFile is a static method and needs a callback
    let dataset;
    await Parser.parseFile(csvFile, (d) => {
      dataset = d;
    });
    
    test('should have a dataset', () => {
        expect(dataset).toBeDefined();
    });
    test('should have a delimiter', () => {
        expect(dataset.delimiter).toBe(',');
    });
    test('should have a mimeType', () => {
        expect(dataset.mimeType).toBe('text/csv');
    });
    test('should have 10 columns', () => {
        expect(dataset.columns.length).toBe(10);
    });
    test('should have 6 rows', () => {
        expect(dataset.data.length).toBe(6);
    });
    test('should have 10 columns in the first row', () => {
        expect(dataset.data[0].length).toBe(10);
    });

    test('should have the correct data in the first row', () => {
        // 50001,2.9929,DE,06/12/2024,3,115,2023-04-11T11:13:00Z,1,5,2.3
        expect(dataset.data[0][0]).toBe('50001');
        expect(dataset.data[0][1]).toBe('2.9929');
        expect(dataset.data[0][2]).toBe('DE');
        expect(dataset.data[0][3]).toBe('06/12/2024');
        expect(dataset.data[0][4]).toBe('3');
        expect(dataset.data[0][5]).toBe('115');
        expect(dataset.data[0][6]).toBe('2023-04-11T11:13:00Z');
        expect(dataset.data[0][7]).toBe('1');
        expect(dataset.data[0][8]).toBe('5');
        expect(dataset.data[0][9]).toBe('2.3');
    });
  });
});

