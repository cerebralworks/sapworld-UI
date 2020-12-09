import { Component } from '@angular/core';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AppGlobals } from '@config/app.global';
import { LoggedIn } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
  public loaderEnabled: boolean = false;

  constructor(
    public translateService: TranslateService,
    public appGlobals: AppGlobals,
    private employerService: EmployerService,
    private userService: UserService,
    private accountService: AccountService,
    private router: Router,
    private employerSharedService: EmployerSharedService,
    private userSharedService: UserSharedService,
    private ngxService: NgxUiLoaderService
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
      if (event instanceof NavigationEnd) {
       if(event.url == '/home') {
        this.loaderEnabled = false;
       }else {
        this.loaderEnabled = true;
       }
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
    if(this.loggedInResponse.isLoggedIn && (this.loggedInResponse && this.loggedInResponse.role && this.loggedInResponse.role.includes(1))){
      this.onGetEmployerProfile();
    }else if(this.loggedInResponse.isLoggedIn && (this.loggedInResponse && this.loggedInResponse.role && this.loggedInResponse.role.includes(0))) {
      this.onGetUserProfile();
    }
  }

  onGetEmployerProfile() {
    // this.ngxService.start();
    this.employerService.profile().subscribe(
      response => {
        // this.ngxService.stop();
        this.employerProfileInfo = response;
        if(this.employerProfileInfo && this.employerProfileInfo.details)
          this.employerSharedService.saveEmployerProfileDetails(this.employerProfileInfo.details);
      }, error => {
        // this.ngxService.stop();
      }
    )
  }

  onGetUserProfile() {
    // this.ngxService.start();
    this.userService.profile().subscribe(
      response => {
        // this.ngxService.stop();
        this.userProfileInfo = response;
        if(this.userProfileInfo && this.userProfileInfo.details)
          this.userSharedService.saveUserProfileDetails(this.userProfileInfo.details);
      }, error => {
        // this.ngxService.stop();
      }
    )
  }

}
