import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppGlobals } from '@config/app.global';
import { AccountLogin } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public langImages: any[] = ['deutsch.png', 'english.png', 'español.png'];
  public langNames: any[] = ['deu', 'eng', 'esp'];
  public isLangMenuOpen: boolean;
  public loggedUserInfo: AccountLogin;
  public accountUserSubscription: Subscription;
  public currentEmployerDetails: any = {};
  public currentCompanyDetails: any = {};
  public currentUserDetails: any = {};
  public randomNum: number;

  constructor(
    public router: Router,
    public translateService: TranslateService,
    public appGlobals: AppGlobals,
    private accountService: AccountService,
    private cdRef: ChangeDetectorRef,
    private employerSharedService: EmployerSharedService,
    private userSharedService: UserSharedService
  ) { }

  ngOnInit(): void {
    this.randomNum = Math.random();
    this.translateService.addLangs(this.appGlobals.availableLanguages);
    this.translateService.use('en');
    this.accountUserSubscription = this.accountService
      .isCurrentUser()
      .subscribe(response => {
        this.loggedUserInfo = response;
      });
      this.employerSharedService.getEmployerProfileDetails().subscribe(
        details => {
          if(details) {
            this.currentEmployerDetails = details;
          }
        }
      )
      this.employerSharedService.getEmployerCompanyDetails().subscribe(
        details => {
          if(details) {
            this.currentCompanyDetails = details;
          }
        }, error => {
          console.log(error);
        }
      )
      this.userSharedService.getUserProfileDetails().subscribe(
        details => {
          if(details) {
            this.currentUserDetails = details;
          }
        }
      )
    if (!this.cdRef['destroyed']) {
      this.cdRef.detectChanges();
    }
  }

  onChangeNameAbb = (name: string) => {
    if(name) {
      let matches = name.match(/\b(\w)/g);
      let acronym = matches.join('');
      return acronym;
    }
    return;
  }

  onRedirectUrl = (url: string) => {
    this.router.navigate([url])
  }

  useLanguage(lang: string): void {
    if(lang) {
      this.translateService.use(lang);
    }
    this.isLangMenuOpen = false;
  }

  onGetLangImage = (lang: string) => {
    const checkValue = this.langImages.some(x => x.includes(lang));
    if(checkValue) {
      const temp = this.langImages.find(val => val.includes(lang));
      return `assets/images/${temp}`;
    }
  }

  onGetLangNames = (lang: string) => {
    const checkValue = this.langNames.some(x => x.includes(lang) );
    if(checkValue) {
      const temp = this.langNames.find(val => val.includes(lang));
      return `${temp}`;
    }
    return '-'
  }

  onOpenLangMenu = () => {
    this.isLangMenuOpen = true;
  }

  logout() {
    this.accountService.logout().subscribe(
      response => {
        this.router.navigate(['/home']);
        localStorage.clear();
      },
      error => {
      }
    );
  }

}
