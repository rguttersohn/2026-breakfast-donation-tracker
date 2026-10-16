import { describe, it, expect } from 'vitest';
import type { CSVData } from '~~/types/csv';
import { parseCurrency, toCurrency, sumColumn } from './currency';

// Amounts are typed by hand into a Google Sheet, so these tests describe how
// the utils *should* behave with messy input: anything that can't be read as
// a number counts as 0, so one bad cell can never break the running total.

function row(amount: string, overrides: Partial<CSVData> = {}): CSVData {

    return {
        "Record ID": '',
        "Date / time": '',
        "Donor / identifier": '',
        "Email  (optional)": '',
        "Source": '',
        "Record type": '',
        "Amount ($)": amount,
        "Notes": '',
        "Counts to committed": '',
        "Counts as received": '',
        ...overrides,
    };

}

describe('parseCurrency', () => {

    describe('valid input', () => {

        it.each([
            ['100', 100],
            ['0', 0],
            ['$1,234.56', 1234.56],
            ['1,000,000', 1000000],
            ['  $50 ', 50],
            ['-25', -25],
            ['$-25', -25],
            ['$100 pledged', 100],
        ])('parses %j as %d', (input, expected) => {
            expect(parseCurrency(input)).toBe(expected);
        });

    });

    describe('empty amounts', () => {

        it.each(['', '   ', '\t', '\n'])('treats %j as 0', (input) => {
            expect(parseCurrency(input)).toBe(0);
        });

    });

    describe('text with no number', () => {

        it.each(['abc', 'N/A', 'TBD', '$'])('treats %j as 0', (input) => {
            expect(parseCurrency(input)).toBe(0);
        });

    });

    describe('malformed numbers', () => {

        it.each(['1.2.3', '-', '.', '1-000', '--5', '$1.000.00'])('treats %j as 0 instead of NaN', (input) => {
            expect(parseCurrency(input)).toBe(0);
        });

    });

    describe('non-string cells from the CSV', () => {

        // Papa.parse leaves a field undefined when a row has fewer columns than the header.
        it.each([undefined, null])('treats %j as 0 without throwing', (input) => {
            expect(() => parseCurrency(input as unknown as string)).not.toThrow();
            expect(parseCurrency(input as unknown as string)).toBe(0);
        });

    });

    it('always returns a finite number', () => {

        const inputs = ['100', '', 'abc', '1.2.3', '-', '.', '(500)', '1-000', '$1,234.56'];

        for (const input of inputs) {
            expect(Number.isFinite(parseCurrency(input)), `input: ${JSON.stringify(input)}`).toBe(true);
        }

    });

});

describe('sumColumn', () => {

    it('returns 0 for no rows', () => {
        expect(sumColumn([], 'Amount ($)')).toBe(0);
    });

    it('sums plain and formatted amounts', () => {
        const data = [row('$100'), row('1,250.50'), row('50')];
        expect(sumColumn(data, 'Amount ($)')).toBe(1400.5);
    });

    it('counts empty amounts as 0', () => {
        const data = [row('100'), row(''), row('   '), row('200')];
        expect(sumColumn(data, 'Amount ($)')).toBe(300);
    });

    it('subtracts negative amounts such as refunds', () => {
        const data = [row('500'), row('-100'), row('$-50')];
        expect(sumColumn(data, 'Amount ($)')).toBe(350);
    });

    it('handles floating point sums', () => {
        const data = [row('0.1'), row('0.2')];
        expect(sumColumn(data, 'Amount ($)')).toBeCloseTo(0.3);
    });

    it('only reads the requested column', () => {
        const data = [row('100', { "Notes": '9999', "Record ID": '42' })];
        expect(sumColumn(data, 'Amount ($)')).toBe(100);
    });

    it('keeps the total finite when one row is malformed', () => {
        const data = [row('100'), row('1.2.3'), row('200')];
        const total = sumColumn(data, 'Amount ($)');
        expect(Number.isFinite(total)).toBe(true);
        expect(total).toBe(300);
    });

    it.each(['-', '.', '1-000', '--5'])('ignores a malformed %j amount among valid rows', (bad) => {
        const data = [row('100'), row(bad), row('50')];
        expect(sumColumn(data, 'Amount ($)')).toBe(150);
    });

    it('ignores text-only amounts', () => {
        const data = [row('100'), row('N/A'), row('pending'), row('50')];
        expect(sumColumn(data, 'Amount ($)')).toBe(150);
    });

    it('does not throw when a row is missing the amount column', () => {
        const short = { "Record ID": '7', "Donor / identifier": 'Jane' } as CSVData;
        const data = [row('100'), short, row('50')];
        expect(() => sumColumn(data, 'Amount ($)')).not.toThrow();
        expect(sumColumn(data, 'Amount ($)')).toBe(150);
    });

    it('does not throw on the trailing blank row Papa.parse produces', () => {
        const trailing = { "Record ID": '' } as CSVData;
        const data = [row('100'), trailing];
        expect(() => sumColumn(data, 'Amount ($)')).not.toThrow();
        expect(sumColumn(data, 'Amount ($)')).toBe(100);
    });

});

describe('toCurrency', () => {

    it.each([
        [0, '$0'],
        [1234.56, '$1,235'],
        [800000, '$800,000'],
        [-500, '-$500'],
    ])('formats %d as %j', (input, expected) => {
        expect(toCurrency(input)).toBe(expected);
    });

    // Documents current behavior: this is what the page shows if a sum ever goes NaN.
    it('formats NaN as "$NaN"', () => {
        expect(toCurrency(NaN)).toBe('$NaN');
    });

});
