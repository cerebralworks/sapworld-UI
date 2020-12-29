// import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

// @Directive({
//     selector: '[clickOutside]'
// })
// export class ClickOutsideDirective {
//     constructor(private _elementRef: ElementRef) {
//     }

//     @Output()
//     public clickOutside = new EventEmitter<MouseEvent>();

//     @HostListener('document:click', ['$event', '$event.target'])
//     public onClick(event: MouseEvent, targetElement: HTMLElement): void {
//       console.log(targetElement);

//         if (!targetElement) {
//             return;
//         }

//         const clickedInside = this._elementRef.nativeElement.contains(targetElement);
//         if (!clickedInside) {
//             this.clickOutside.emit(event);
//         }
//     }
// }


import { Directive, ElementRef, Optional, Inject, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[outsideClick]',
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
  @Output('outsideClick') outsideClick = new EventEmitter<MouseEvent>();

  private subscription: Subscription;

  constructor(private element: ElementRef, @Optional() @Inject(DOCUMENT) private document: any) {}

  ngOnInit() {
    setTimeout(() => {
      this.subscription = fromEvent<MouseEvent>(this.document, 'click')
        .pipe(
          filter(event => {
            const clickTarget = event.target as HTMLElement;
            return !this.isOrContainsClickTarget(this.element.nativeElement, clickTarget);
          }),
        )
        .subscribe(event => this.outsideClick.emit());
    }, 0);
  }

  private isOrContainsClickTarget(element: HTMLElement, clickTarget: HTMLElement) {
    return element == clickTarget || element.contains(clickTarget);
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
