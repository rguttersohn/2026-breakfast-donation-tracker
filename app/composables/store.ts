import type { CSVData } from './../../types/csv';


const GOAL = 100000;

const csvObject = ref<CSVData[]>();

const total = computed(():number => {

  if(!csvObject.value){

    return 0;

  }
  
  const total = csvObject.value.reduce((a, b) =>{

    return a + parseCurrency(b["Amount ($)"]);

  }, 0)

  return total;

});

const total_string = computed(()=>total.value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
);

const total_percent = computed(()=>`${(total.value/GOAL*100).toFixed(0)}%`);

export function useStore(){

    return {
        csvObject,
        total, 
        total_string,
        total_percent
    }

}