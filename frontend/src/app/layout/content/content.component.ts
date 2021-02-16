import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { UserSharedService } from '@data/service/user-shared.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnDestroy {
  accountUserSubscription: any;
  loggedUserInfo: any;

  constructor(
    private employerSharedService: EmployerSharedService,
    private userSharedService: UserSharedService,
    private accountService: AccountService
    ) { }

  ngOnInit(): void {
    this.accountUserSubscription = this.accountService
      .isCurrentUser()
      .subscribe(response => {
        this.loggedUserInfo = response;
      });
  }

  ngOnDestroy(): void {
    if(this.loggedUserInfo && !this.loggedUserInfo.isLoggedIn) {
      this.userSharedService.clearUserProfileDetails();
      this.employerSharedService.clearEmployerProfileDetails();
    }

  }

}
