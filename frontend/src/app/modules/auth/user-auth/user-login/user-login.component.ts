import { Component, OnInit,HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

public screenWidth: any;
  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
	  this.screenWidth = window.innerWidth;
  }
@HostListener('window:resize', ['$event'])  
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }

}
