import type { CSVData } from './../../types/csv';

const GOAL = 800000;

const TOTAL_BASE = 730000;

const csvObject = ref<CSVData[]>();

const total = computed(():number => {

  if(!csvObject.value){

    return TOTAL_BASE;

  }
  
  const total = sumColumn(csvObject.value, 'Amount ($)');

  return TOTAL_BASE + total;

});

const donors = computed(()=>{

  if(!csvObject.value){

    return [];

  }

  return csvObject.value.map(data=>({
    donor: data["Donor / identifier"],
    amount: data["Amount ($)"],
    type: data["Record type"]
  }))


})

const total_string = computed(()=>toCurrency(total.value));

const total_percent = computed(()=>`${(total.value/GOAL*100).toFixed(0)}%`);

const goal_string = computed(()=>toCurrency(GOAL));

const goalDifference = computed(()=>GOAL - total.value);

const goalDifference_string = computed(()=>toCurrency(goalDifference.value));

export function useStore(){

    return {
        csvObject,
        donors,
        total, 
        total_string,
        total_percent,
        goal: GOAL,
        goal_string,
        goalDifference,
        goalDifference_string
    }

}