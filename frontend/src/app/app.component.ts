import { Component } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { AppGlobals } from '@config/app.global';
import { LoggedIn } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public title = 'sap-world';
  public loggedInResponse: LoggedIn;
  public employerProfileInfo: any = {};
  public userProfileInfo: any = {};

  constructor(
    public translateService: TranslateService,
    public appGlobals: AppGlobals,
    private employerService: EmployerService,
    private userService: UserService,
    private accountService: AccountService,
    private router: Router,
    private employerSharedService: EmployerSharedService,
    private userSharedService: UserSharedService
  ) {
  }

  ngOnInit(): void {
    let browserLang = this.translateService.getBrowserLang();
    if (this.appGlobals.availableLanguages.indexOf(browserLang) > -1) {
      this.translateService.setDefaultLang(browserLang);
    } else {
      this.translateService.setDefaultLang('en');
    }

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.checkUserLoggedIn();
      }
    });
  }

  public useLanguage(lang: string): void {
    this.translateService.setDefaultLang(lang);
  }

  checkUserLoggedIn = () => {
    this.accountService.checkUserloggedIn().subscribe(
      response => {
        this.loggedInResponse = response;
        this.getUserInfo();
      },
      error => {
      }
    );
  };

  getUserInfo = () => {
    console.log(this.loggedInResponse.role.includes(0));

    if(this.loggedInResponse.isLoggedIn && (this.loggedInResponse && this.loggedInResponse.role && this.loggedInResponse.role.includes(1))){
      this.onGetEmployerProfile();
    }else if(this.loggedInResponse.isLoggedIn && (this.loggedInResponse && this.loggedInResponse.role && this.loggedInResponse.role.includes(0))) {
      this.onGetUserProfile();
    }
  }

  onGetEmployerProfile() {
    this.employerService.profile().subscribe(
      response => {
        this.employerProfileInfo = response;
        if(this.employerProfileInfo && this.employerProfileInfo.details)
          this.employerSharedService.saveEmployerProfileDetails(this.employerProfileInfo.details);
      }, error => {
      }
    )
  }

  onGetUserProfile() {
    this.userService.profile().subscribe(
      response => {
        this.userProfileInfo = response;
        if(this.userProfileInfo && this.userProfileInfo.details)
          this.userSharedService.saveUserProfileDetails(this.userProfileInfo.details);
      }, error => {
      }
    )
  }

}
