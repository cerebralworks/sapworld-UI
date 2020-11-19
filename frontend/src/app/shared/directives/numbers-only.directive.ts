import { Directive, HostListener,Input } from "@angular/core";
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[numbersOnly]'
})
export class NumbersOnlyDirective {

  constructor(private ngControl: NgControl) { }

  @HostListener('input', ['$event']) onInput(event): void {
    const value = event.target.value;
    this.ngControl.control.setValue(parseFloat(value) || 0);
    if (value.slice(-1) === '.' && !value.slice(0, -1).includes('.')) {
      event.target.value = value;
    }
  }
}
