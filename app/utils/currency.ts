import type { CSVData } from "~~/types/csv";

export function parseCurrency(str:string | undefined | null):number{
    
    if(!str){
        
        return 0;
        
    }

    const number = Number(str.replace(/[^0-9.-]/g, ''))

    if(Number.isNaN(number)){

        return 0;

    }

    return number;

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