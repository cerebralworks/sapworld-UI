import {Component, NgModule, VERSION, Pipe, PipeTransform} from '@angular/core'
import {BrowserModule, DomSanitizer} from '@angular/platform-browser'
/*
 * Highlighjt the letter of the string
 * Takes a string as a value.
 * Usage:
 *  [innerHTML]="fieldName | highlightText: searchText"
 *  formats to: Studioq
*/
@Pipe({
    name: 'highlightText'
})
export class HighlightTextPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){}

  transform(value: any, args: any): any {
    if (!args) {
      return value;
    }
    // Match in a case insensitive maneer
    const re = new RegExp(args, 'gi');
    const match = value.match(re);

    // If there's no match, just return the original value.
    if (!match) {
      return value;
    }

    const result = value.replace(re, "<mark>" + match[0] + "</mark>");
    return this.sanitizer.bypassSecurityTrustHtml(result);
  }
}