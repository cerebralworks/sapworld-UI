import { Component, OnInit, AfterViewInit } from '@angular/core';
import KTLayoutFooter from '../../../../../assets/js/layout/base/footer';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, AfterViewInit {
  footerContainerCSSClasses: string;
  currentYear: string;

  constructor() {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear().toString();
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    // Init Footer
    KTLayoutFooter.init('kt_footer');
  }
}
