import Papa from "papaparse";
import type { CSVData } from "~~/types/csv";
import { sumColumn } from "./currency";

export function parseDonationsCsv(csvText:string):CSVData[]{

    const parsed = Papa.parse<CSVData>(csvText, {
        header: true,
        skipFirstNLines: 3,
        skipEmptyLines: 'greedy',
        transformHeader: function(header) {
            return header.trim();
        },
    });

    return parsed.data;

}

export function calcProgress(rows:CSVData[] | undefined, base:number, goal:number){

    const total = rows ? base + sumColumn(rows, 'Amount ($)') : base;

    return {
        total,
        percent: `${(total/goal*100).toFixed(1)}%`,
        remaining: (goal - total) > 0 ? (goal - total) : 0,
    };

}
