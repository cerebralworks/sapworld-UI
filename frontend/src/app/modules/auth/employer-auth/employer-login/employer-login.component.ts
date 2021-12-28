import { Component, OnInit,HostListener  } from '@angular/core';
export {}; declare global { interface Window { Parallax: any; } } 

@Component({
  selector: 'app-employer-login',
  templateUrl: './employer-login.component.html',
  styleUrls: ['./employer-login.component.css']
})
export class EmployerLoginComponent implements OnInit {
public screenWidth: any;
public translatePage='en';
  constructor() { }

  ngOnInit(): void {
	  this.screenWidth = window.innerWidth;
	  setTimeout(() => {
		  var scene = document.getElementById('scene');
			new window.Parallax(scene)
	  });
	  
  }
  /* ngAfterViewInit(): void {
	  setTimeout(() => {
		  var scene = document.getElementById('scene');
			new window.Parallax(scene)
	  });
  } */
@HostListener('window:resize', ['$event'])  
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }  
}
