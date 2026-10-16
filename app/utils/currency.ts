import type { CSVData } from "~~/types/csv";

export function parseCurrency(str:string){
    
    return Number(str.replace(/[^0-9.-]/g, ''))

};

export function toCurrency(number:number){

    return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
      });
      
}

export function sumColumn(data:CSVData[], column:keyof CSVData){

    return data.reduce((a, b) =>{

        return a + parseCurrency(b[column]);

    }, 0);


}