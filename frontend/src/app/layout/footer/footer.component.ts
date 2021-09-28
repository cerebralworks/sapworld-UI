import { Component, OnInit } from '@angular/core';
import { AccountLogin } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
	
  public loggedUserInfo: AccountLogin;
  today: number = Date.now();
  public accountUserSubscription: Subscription;
  constructor(
    private accountService: AccountService
	) { }

  ngOnInit(): void {
	  this.accountUserSubscription = this.accountService
      .isCurrentUser()
      .subscribe(response => {
        this.loggedUserInfo = response;
      });
  }
	
}
