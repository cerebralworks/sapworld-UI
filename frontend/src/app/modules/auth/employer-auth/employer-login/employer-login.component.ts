import { Component, OnInit,HostListener  } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedIn } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';

export {}; declare global { interface Window { Parallax: any; } } 

@Component({
  selector: 'app-employer-login',
  templateUrl: './employer-login.component.html',
  styleUrls: ['./employer-login.component.css']
})
export class EmployerLoginComponent implements OnInit {
public screenWidth: any;
public translatePage='en';
  public loggedUserInfo: LoggedIn;
  constructor(
    private router: Router,
    private accountService: AccountService) { }

  ngOnInit(): void {
	  this.accountService
	  .isCurrentUser()
	  .subscribe(response => {
		this.loggedUserInfo = response;
		if(response.role.includes(1)){
			this.router.navigate(['/employer/dashboard']);
		}else if(response.role.includes(0)){
			this.router.navigate(['/user/dashboard']);
		}
	  });
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
