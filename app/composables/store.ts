import type { CSVData } from './../../types/csv';

const GOAL = 800000;

const TOTAL_BASE = 730000;

const csvObject = ref<CSVData[]>();

export async function fetchDonations():Promise<CSVData[]>{

  const SHEET_ID = "1YzRPvDuZRVfQsGPMY5SrtDYdxtPhqiuIYaNJVK-LPPE";

  const GID = "1364117045";

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

  const response = await $fetch<string>(url);

  return parseDonationsCsv(response);

}


const progress = computed(()=>calcProgress(csvObject.value, TOTAL_BASE, GOAL));

const total = computed(():number => progress.value.total);

const total_string = computed(()=>toCurrency(total.value));

const total_percent = computed(()=>progress.value.percent);

const goal_string = computed(()=>toCurrency(GOAL));

const goalDifference = computed(()=>progress.value.remaining);

const goalDifference_string = computed(()=>toCurrency(goalDifference.value));

export function useStore(){

    return {
        csvObject,
        fetchDonations,
        total,
        total_string,
        total_percent,
        goal: GOAL,
        goal_string,
        goalDifference,
        goalDifference_string
    }

}
