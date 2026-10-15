export function parseCurrency(str:string){
    
    return Number(str.replace(/[^0-9.-]/g, ''))

};