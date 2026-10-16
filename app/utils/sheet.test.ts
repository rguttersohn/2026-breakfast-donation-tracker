import { describe, it, expect } from 'vitest';
import type { CSVData } from '~~/types/csv';
import { parseDonationsCsv, calcProgress } from './sheet';

// Fixtures mimic the Google Sheets CSV export: 3 preamble lines above the
// header row, then one line per donation. Like currency.test.ts, these tests
// describe the *desired* behavior, so failures point at what needs hardening.

const PREAMBLE = [
    'Breakfast Fund Donations,,,,,,,,,',
    'Updated live,,,,,,,,,',
    ',,,,,,,,,',
];

const HEADER = 'Record ID,Date / time,Donor / identifier,Email  (optional),Source,Record type,Amount ($),Notes,Counts to committed,Counts as received';

function csvRow(id: string, amount: string): string {
    return `${id},10/1/2026 9:00,Donor ${id},,Online,Gift,${amount},,Yes,Yes`;
}

function csv(lines: string[], { preamble = PREAMBLE, header = HEADER } = {}): string {
    return [...preamble, header, ...lines].join('\n');
}

function row(amount: string): CSVData {

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
    };

}

describe('parseDonationsCsv', () => {

    it('parses a normal export into rows keyed by header name', () => {

        const rows = parseDonationsCsv(csv([csvRow('1', '100'), csvRow('2', '250')]));

        expect(rows).toHaveLength(2);
        expect(rows[0]).toMatchObject({
            "Record ID": '1',
            "Donor / identifier": 'Donor 1',
            "Amount ($)": '100',
        });
        expect(rows[1]!["Amount ($)"]).toBe('250');

    });

    it('keeps quoted amounts with commas in one field', () => {

        const rows = parseDonationsCsv(csv([csvRow('1', '"$1,250.00"')]));

        expect(rows[0]!["Amount ($)"]).toBe('$1,250.00');
        expect(rows[0]!["Notes"]).toBe('');

    });

    it('returns no rows when the sheet has only a header', () => {
        expect(parseDonationsCsv(csv([]))).toEqual([]);
    });

    it('does not produce a partial row from a trailing newline', () => {

        const rows = parseDonationsCsv(csv([csvRow('1', '100')]) + '\n');

        expect(rows).toHaveLength(1);

    });

    it('skips blank rows in the middle of the sheet', () => {

        const rows = parseDonationsCsv(csv([csvRow('1', '100'), '', csvRow('2', '50')]));

        expect(rows).toHaveLength(2);

    });

    it('gives every row an Amount ($) field', () => {

        const rows = parseDonationsCsv(csv([csvRow('1', '100'), '', csvRow('2', '50')]) + '\n');

        for (const r of rows) {
            expect(r).toHaveProperty(['Amount ($)']);
            expect(typeof r["Amount ($)"]).toBe('string');
        }

    });

});

describe('calcProgress', () => {

    it('uses the base total before any data has loaded', () => {
        expect(calcProgress(undefined, 730000, 800000)).toEqual({
            total: 730000,
            percent: '91.3%',
            remaining: 70000,
        });
    });

    it('uses the base total for an empty sheet', () => {
        expect(calcProgress([], 730000, 800000).total).toBe(730000);
    });

    it('adds the sheet amounts to the base', () => {

        const progress = calcProgress([row('$100'), row('25')], 0, 1000);

        expect(progress).toEqual({ total: 125, percent: '12.5%', remaining: 875 });

    });

    it('formats percent with one decimal place', () => {
        expect(calcProgress([row('1')], 0, 3).percent).toBe('33.3%');
        expect(calcProgress([], 500, 1000).percent).toBe('50.0%');
    });

    it('reports the true percent once the goal is passed', () => {
        expect(calcProgress([row('50')], 1000, 1000).percent).toBe('105.0%');
    });

    it('never reports a negative amount remaining once the goal is passed', () => {

        // total-raised.vue shows this as "{remaining} to go".
        expect(calcProgress([row('5000')], 800000, 800000).remaining).toBe(0);

    });

    it('keeps total, percent and remaining finite when a row is malformed', () => {

        const progress = calcProgress([row('100'), row('1.2.3')], 0, 1000);

        expect(Number.isFinite(progress.total)).toBe(true);
        expect(Number.isFinite(progress.remaining)).toBe(true);
        expect(progress.percent).not.toBe('NaN%');

    });

});

describe('parseDonationsCsv + calcProgress', () => {

    it('does not crash on a real-looking export with a trailing newline', () => {

        const text = csv([csvRow('1', '"$1,000"'), csvRow('2', '500'), '']) + '\n';

        expect(() => calcProgress(parseDonationsCsv(text), 0, 10000)).not.toThrow();
        expect(calcProgress(parseDonationsCsv(text), 0, 10000).total).toBe(1500);

    });

});
