import { Component, OnInit,HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoggedIn } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

public screenWidth: any;
  public loggedUserInfo: LoggedIn;
  constructor(public translate: TranslateService, private router: Router,private accountService: AccountService) { }

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
  }
@HostListener('window:resize', ['$event'])  
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }

}
