import { ChangeDetectorRef, Component, OnInit,HostListener, TemplateRef, ViewChild,} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AppGlobals } from '@config/app.global';
import { AccountLogin } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DataService } from '@shared/service/data.service';
import { environment as env } from '@env';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
  public employerprofilepath : any;	
  public userprofilepath : any;	
  public mbRefs: NgbModalRef;
  @ViewChild('deleteAccountModal', { static: false }) deleteAccountModal: TemplateRef<any>;
  public modelshow :boolean=false;
  public jobId:any;
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
	private _notificationService: PushNotificationsService,
	private modelService: NgbModal,
	private route:ActivatedRoute
  ) { 
     this.jobId=this.route.snapshot.queryParamMap.get('id');
    }

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
      });
      this.employerSharedService.getEmployerProfileDetails().subscribe(
        details => {
          if(details) {
            this.currentEmployerDetails = details;
			this.employerprofilepath = `${env.apiUrl}/images/employer/${details.photo}`;
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
			this.userprofilepath = `${env.apiUrl}/images/user/${details.photo}`;
			
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
    if(this.router.url.includes('linkedin-share') || this.route.snapshot.queryParams['linkedin'] !=undefined){
	  this.router.navigate([url],{queryParams:{'linkedin':this.jobId}})
	}else{
      this.router.navigate([url])
	}
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
  
  /* To open popup for delete account*/
  
  openpopup(){
  
      this.modelshow = true;
		setTimeout(() => {
			this.mbRefs = this.modelService.open(this.deleteAccountModal, {
				windowClass: 'modal-holder',
				centered: true,
				backdrop: 'static',
				keyboard: false
			});
		});
 
  
  }
  
   /* To close popup for delete account*/
   
  closepopup(){
  
  this.modelshow = false;
  this.mbRefs.close();
  
  }
  
  /* To delete the user account */
  
  deleteaccount(){
  
     var data ={
	   id:this.currentUserDetails.account
	 };
    this.accountService.userDeleteAccount(data).subscribe(data=>{
	   this.closepopup();
	   this.logout();
	})
  
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
