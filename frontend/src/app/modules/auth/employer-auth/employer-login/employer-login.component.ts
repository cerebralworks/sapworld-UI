import { Component, OnInit,HostListener  } from '@angular/core';

@Component({
  selector: 'app-employer-login',
  templateUrl: './employer-login.component.html',
  styleUrls: ['./employer-login.component.css']
})
export class EmployerLoginComponent implements OnInit {
public screenWidth: any;
  constructor() { }

  ngOnInit(): void {
	  this.screenWidth = window.innerWidth;
  }
@HostListener('window:resize', ['$event'])  
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }  
}
