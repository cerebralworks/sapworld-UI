import { Pipe, PipeTransform } from '@angular/core';
/*
 * Capitalize the first letter of the string
 * Takes a string as a value.
 * Usage:
 *  value | capitalizefirst
 * Example:
 *  // value.name = studioq
 *  {{ value.name | capitalizefirst  }}
 *  fromats to: Studioq
*/
@Pipe({
  name: 'capitalizeFirst'
})
export class CapitalizeFirstPipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    if (!value) return null;
    const tempValue = value.trim();    
    return tempValue.charAt(0).toUpperCase() + tempValue.slice(1).toLowerCase();
  }
}