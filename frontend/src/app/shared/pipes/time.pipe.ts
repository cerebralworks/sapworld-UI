import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'time'
})
export class TimePipe implements PipeTransform {
  constructor(){}

	transform(value: any, args: any): any {
		

		if(value){
			value= value.split(':');
			var maxCheck_1:any=parseInt(value[0]);
			if(12<maxCheck_1){
				maxCheck_1 = maxCheck_1-12;
				maxCheck_1 = maxCheck_1+':'+value[1]+' PM ';
				return maxCheck_1;
			}else{
				maxCheck_1 = maxCheck_1+' : '+value[1]+' AM ';
				return maxCheck_1;
			}
			
		}
		var tempSend ='';
		return tempSend;
	}
}