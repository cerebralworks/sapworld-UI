import { ChangeDetectorRef, Component, OnInit,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AppGlobals } from '@config/app.global';
import { AccountLogin } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DataService } from '@shared/service/data.service';
import {
    PushNotificationsService
} from '@shared/service/notification.service';
import {Location} from '@angular/common';


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
	public screenWidth: any;
	
  constructor(
    public router: Router,
    public translateService: TranslateService,
    public appGlobals: AppGlobals,
    private accountService: AccountService,
    private cdRef: ChangeDetectorRef,
    private locations: Location,
	private dataService: DataService,
    private employerSharedService: EmployerSharedService,
    private userSharedService: UserSharedService,
	private _notificationService: PushNotificationsService
  ) { }

  ngOnInit(): void {
	  this.screenWidth = window.innerWidth;
	  this._notificationService.requestPermission();
    this.randomNum = Math.random();
    this.translateService.addLangs(this.appGlobals.availableLanguages);
	if(!this.translateService.store.currentLang){
		this.translateService.use('en');
	}
    
    this.accountUserSubscription = this.accountService
      .isCurrentUser()
      .subscribe(response => {
        this.loggedUserInfo = response;
		if(this.loggedUserInfo.role.length==1){
			if(window.location.hash === '#/home' || window.location.hash === '#/auth/user/login' ||  window.location.hash === '#/auth/employer/login' ){
				if(response.role.includes(1)){
					this.router.navigate(['/employer/dashboard']);
				}else if(response.role.includes(0)){
					this.router.navigate(['/user/dashboard']);
					
				}
			}
			
		}
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
  
  navigateNotification(){
	  
	  this.router.navigate(['/notification']);
	  if(this.locations.path() =='/notification'){
		  this.dataService.setNotificationDataSource({total:true});
	  }
  }

  logout() {
    this.accountService.logout().subscribe(
      response => {
        this.router.navigate(['']);
        localStorage.clear();
      },
      error => {
      }
    );
  }

  @HostListener('window:resize', ['$event'])  
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }
}
