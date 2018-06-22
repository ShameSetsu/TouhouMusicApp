import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'msToTime'})
export class MsToTime implements PipeTransform {
    transform(value: number) {
        console.log('TIMER', Math.floor(value/1000/60) + ':' + ((Math.round(value/1000%60).toString().length == 2) ? Math.round(value/1000%60) : '0' + Math.round(value/1000%60)));
        if (value) return Math.floor(value/1000/60) + ':' + ((Math.round(value/1000%60).toString().length == 2) ? Math.round(value/1000%60) : '0' + Math.round(value/1000%60));
        return value;
    }
}