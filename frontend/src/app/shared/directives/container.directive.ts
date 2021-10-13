import { Directive, OnInit, ElementRef, Renderer2, NgModule,HostListener } from '@angular/core';

@Directive({
  selector: '[containerDirective]'
})
export class ContainerDirective implements OnInit {
	
	public screenWidth: any;
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    const parent = this.renderer.parentNode(this.el.nativeElement);

  }
  
  @HostListener('window:resize', ['$event'])  
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }
  
}
