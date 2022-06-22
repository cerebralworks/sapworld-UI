import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnDestroy {
  accountUserSubscription: any;
  loggedUserInfo: any;
  public showData:boolean = false;

  constructor(
    private employerSharedService: EmployerSharedService,
    private userSharedService: UserSharedService,
    public router: Router,
    private accountService: AccountService
    ) { }
  /**
   * To initialize the content component
   */
  ngOnInit(): void {
    this.accountUserSubscription = this.accountService
      .isCurrentUser()
      .subscribe(response => {
        this.loggedUserInfo = response;
      });
		setTimeout(() => {
		  this.showData = true	
		},300);
  }
  /**
   * To destroy the page if leaves
   */
  ngOnDestroy(): void {
    if(this.loggedUserInfo && !this.loggedUserInfo.isLoggedIn) {
      this.userSharedService.clearUserProfileDetails();
      this.employerSharedService.clearEmployerProfileDetails();
    }

  }

}
