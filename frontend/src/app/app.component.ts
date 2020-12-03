import { Component } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { AppGlobals } from '@config/app.global';
import { LoggedIn } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
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

  constructor(
    public translateService: TranslateService,
    public appGlobals: AppGlobals,
    private employerService: EmployerService,
    private accountService: AccountService,
    private router: Router,
    private employerSharedService: EmployerSharedService
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
    if(this.loggedInResponse.isLoggedIn && (this.loggedInResponse && this.loggedInResponse.role && this.loggedInResponse.role.includes(1))){
      this.onGetEmployerProfile();
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

}
