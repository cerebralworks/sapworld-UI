import { Component, OnInit,HostListener } from '@angular/core';
import { AccountLogin } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
	public screenWidth: any;
  public loggedUserInfo: AccountLogin;
  today: number = Date.now();
  public accountUserSubscription: Subscription;
  constructor(
    private accountService: AccountService
	) { }

  ngOnInit(): void {
	  this.screenWidth = window.innerWidth;
	  this.accountUserSubscription = this.accountService
      .isCurrentUser()
      .subscribe(response => {
        this.loggedUserInfo = response;
      });
  }
  
  @HostListener('window:resize', ['$event'])  
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }
  
	
}
