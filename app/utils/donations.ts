import Papa from "papaparse";
import type { CSVData } from "~~/types/csv";

export async function fetchDonations():Promise<CSVData[]>{

    const SHEET_ID = "1YzRPvDuZRVfQsGPMY5SrtDYdxtPhqiuIYaNJVK-LPPE";

    const GID = "1364117045";

    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

    const response = await $fetch<string>(url);

    const parsed = Papa.parse<CSVData>(response, {
        header: true,
        skipFirstNLines: 3,
    });

    return parsed.data;

}