import { Directive, HostListener, Self, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Directive({
  selector: '[currencyFormatter]'
})
export class CurrencyFormatterDirective implements OnDestroy {

  private formatter: Intl.NumberFormat;
  private destroy$ = new Subject<void>();
  private countryTemp: any;

  @Input('country')
  set country(value: any) {
    this.countryTemp = value
  }

  constructor(@Self() private ngControl: NgControl, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.formatter = new Intl.NumberFormat(this.countryTemp ? this.countryTemp : 'en-IN', { maximumFractionDigits: 2 });
  }

  ngAfterViewInit() {
	  if(this.ngControl.value ==="NaN" || !this.ngControl.value || this.ngControl.value == undefined){
		  this.setValue(this.formatPrice(null))
	  }else{
		  this.setValue(this.formatPrice(this.ngControl.value))
	  }
    
    this.ngControl
      .control
      .valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.updateValue.bind(this));
      this.cdr.detectChanges();
  }

  updateValue(value) {
    let inputVal = value || '';
    this.setValue(!!inputVal ?
      this.validateDecimalValue(inputVal.replace(/[^0-9.]/g, '')) : '');
  }

  @HostListener('focus') onFocus() {
    this.setValue(this.unformatValue(this.ngControl.value));
  }

  @HostListener('blur') onBlur() {
    let value = this.ngControl.value || '';
    !!value && this.setValue(this.formatPrice(value));
  }

  formatPrice(v) {
    return this.formatter.format(v);
  }

  unformatValue(v) {
    if(v) {
      return v.replace(/,/g, '');
    }
  }

  validateDecimalValue(v) {
    // Check to see if the value is a valid number or not
    if (Number.isNaN(Number(v))) {
      // strip out last char as this would have made the value invalid
      const strippedValue = v.slice(0, v.length - 1);

      // if value is still invalid, then this would be copy/paste scenario
      // and in such case we simply set the value to empty
      return Number.isNaN(Number(strippedValue)) ? '' : strippedValue;
    }
    return v;
  }

  setValue(v) {
    this.ngControl.control.setValue(v != 0 ? v : undefined, { emitEvent: false })
  }

  ngOnDestroy() {
    if(this.ngControl.value) {
      this.setValue(this.unformatValue(this.ngControl.value));
      this.destroy$.next();
      this.destroy$.complete();
    }

  }

}
