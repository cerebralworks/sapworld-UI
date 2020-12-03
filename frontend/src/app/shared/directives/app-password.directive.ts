import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPassword]'
})
export class AppPasswordDirective {
  private shown = false;

  constructor(private el: ElementRef) {
    this.setup();
  }

  toggle(span: HTMLElement) {
    this.shown = !this.shown;
    if (this.shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      span.innerHTML = `<div class='input-group-append'>
      <span style='cursor: pointer;' class='btn input-icon input-group-text'>
      <i class='sz-eye'></i>
      </span>
      </div>`;
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      span.innerHTML = `<div class='input-group-append'>
      <span style='cursor: pointer;' class='btn input-icon input-group-text'>
      <i class='sz-eye'></i>
      </span>
      </div>`;
    }
  }

  setup() {
    const parent = this.el.nativeElement.parentNode;
    const div = document.createElement('div');
    div.setAttribute('class', 'input-group-append');
    div.innerHTML = `<span style='cursor: pointer;' class='btn input-icon input-group-text'><i class='sz-eye'></i></span>`;
    div.addEventListener('click', event => {
      this.toggle(div);
    });
    parent.appendChild(div);
  }
}
