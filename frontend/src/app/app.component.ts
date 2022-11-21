import { Component,Inject } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AppGlobals } from '@config/app.global';
import { LoggedIn } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedApiService } from '@shared/service/shared-api.service';
import { DataService } from '@shared/service/data.service';
import { PushNotificationsService } from '@shared/service/notification.service';
declare let gtag: Function;
import * as moment from 'moment';
import { filter } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
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
  public check: boolean = false;
  public returnEmployerUrl: any;
  public totalValue: any = 0;
  public returnUserUrl: any;

  constructor(
    public translateService?: TranslateService,
    public appGlobals?: AppGlobals,
    private employerService?: EmployerService,
    private userService?: UserService,
    private accountService?: AccountService,
    private sharedApiService?: SharedApiService,
    private router?: Router,
	private dataService?: DataService,
    private employerSharedService?: EmployerSharedService,
    private userSharedService?: UserSharedService,
    private route?: ActivatedRoute,
    private ngxService?: NgxUiLoaderService,
	private _notificationService?: PushNotificationsService,
	private metaService?:Meta,
	@Inject(DOCUMENT) private document?: any,
    private titleService?:Title
  ) { this._notificationService.requestPermission();
      this.checkUserLoggedIn();   
  }

  ngOnInit(): void {
  //To change dynamic job title
  if(this.document.location.pathname=='/linkedin-share'){
	   var job=decodeURIComponent(this.document.location.search.split('job=')[1].split('&id')[0].replace('-',' '));
	   
	   this.titleService.setTitle(job);
       this.metaService.updateTag({property: 'og:title', content: job});
       this.metaService.updateTag({name: 'title', content: job});
	 }
	 
  this.setUpAnalytics();
    this.returnEmployerUrl = this.route.snapshot.queryParams['redirect'] || '/employer/dashboard';
    this.returnUserUrl = this.route.snapshot.queryParams['redirect'] || '/user/dashboard';


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
	 window.onload = (event) => {
	var splashscreen:HTMLElement = document.getElementById('splash-screen');
	splashscreen.style.display="none";
	}
	this.dataService.getNotificationDataSource().subscribe(
	  response => {
		if(response && response['total']) {
			if(response['total'] ==true ){
				this.totalValue =0;
			}
		}
	  }, error => {
	  });
  }

  public useLanguage(lang: string): void {
    this.translateService.setDefaultLang(lang);
  }


setUpAnalytics() {
     this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
       gtag('event', 'page_view', {
          page_path: event.urlAfterRedirects
       });
      })
}


  checkUserLoggedIn = () => {
    this.accountService.checkUserloggedIn().subscribe(
      response => {
        this.loggedInResponse = response;
		var redir = response.role[0] ===0 ?'/user/dashboard':'/employer/dashboard';
        if(this.loggedInResponse && (this.loggedInResponse.isLoggedIn == false)) {
          this.validateCall = 0;
        }else if(this.loggedInResponse && this.loggedInResponse.isLoggedIn === true){
			if(!this.router.url.includes('/auth') && !this.router.url.includes('/user') && !this.router.url.includes('/employer') && !this.router.url.includes('/notification') && this.loggedInResponse.role[0] !==2 && !this.router.url.includes('/linkedin-share') && !this.router.url.includes('/social-share') && !this.router.url.includes('/privacy-policy') && !this.router.url.includes('/cookie-policy') && !this.router.url.includes('/terms-and-conditions')){
		      this.router.navigate([redir]);
		    }
		}
        this.getUserInfo();
      },
      error => {
      }
    );
  };

  getUserInfo = () => {
    if(this.loggedInResponse.isLoggedIn && (this.loggedInResponse && this.loggedInResponse.role && this.loggedInResponse.role.includes(1))){
      this.onGetEmployerProfile();
      this.getCommonData();
	  this.getNotificationEmployee();
	  
    }else if(this.loggedInResponse.isLoggedIn && (this.loggedInResponse && this.loggedInResponse.role && this.loggedInResponse.role.includes(0))) {
      this.onGetUserProfile();
      this.getCommonData();
	  this.getNotification();
    }
  }
 
  
  getNotification(){
	  if(this.loggedInResponse.isLoggedIn && (this.loggedInResponse && this.loggedInResponse.role)) {
		setTimeout(() => {
			//this.loaderEnabled = false;
			let params:any ={};
			params.view = 'user';
			this.employerService.onGetNotification(params).subscribe(
			  response => {
			   //console.log(response)
				if(response && response['data']) {
					if(window.location.href.includes('notification') && this.check ==false){
						this.totalValue =0;
						this.check = true;
					}else if(!window.location.href.includes('notification')){
						this.check = false;
						this.dataService.clearNotificationDataSource();
					}
					let data: Array < any >= response['data'];
					data = data.map(elm => ({ title: elm.title, alertContent: elm.message}));
					
					var val:any = document.getElementById('notifi_count');
					this.totalValue =  response['count'];
					if(this.totalValue !=0){
						
						document.getElementById('notifi_count')['style']['display']='block';
						document.getElementById('notifi_color')['style']['display']='block';
						document.getElementById('notifi_count')['innerHTML']=this.totalValue;
						if((this.userProfileInfo['details']['privacy_protection']['employer_mail_send']===true && data[0]['title'] === "Job Invitation") || (this.userProfileInfo['details']['privacy_protection']['new_match']===true && data[0]['title'] === "New Job Matches")){
						this._notificationService.generateNotification(data);
						}
					}else{
						document.getElementById('notifi_count')['style']['display']='none';
						document.getElementById('notifi_color')['style']['display']='none';
					}
				}
				this.getNotification();
			  }, error => {
				  //this.router.navigate(['/auth/user/login']);
			  }
			)
			
		},5000);
	  }
  }
  
  getNotificationEmployee(){
		setTimeout(() => {
			//this.loaderEnabled = false;
			let params:any ={};
			params.view = 'employee';
			this.employerService.onGetNotification(params).subscribe(
			  response => {
				if(response && response['data']) {
					if(window.location.href.includes('notification') && this.check ==false){
						this.totalValue =0;
						this.check = true;
					}else if(!window.location.href.includes('notification')){
						this.check = false;
						this.dataService.clearNotificationDataSource();
					}
					let data: Array < any >= response['data'];
					data = data.map(elm => ({ title: elm.title, alertContent: elm.message}));
					var val:any = document.getElementById('notifi_count');
					this.totalValue =  response['count'];
					if(this.totalValue !=0){
						document.getElementById('notifi_count')['style']['display']='block';
						document.getElementById('notifi_color')['style']['display']='block';
						document.getElementById('notifi_count')['innerHTML']=this.totalValue;
						if((this.employerProfileInfo['details']['privacy_protection']['new_match']===true && data[0]['title'] === "New User Matches") || (this.employerProfileInfo['details']['privacy_protection']['new_candidate_applied']===true && data[0]['title'] === "New Application Request")){
						this._notificationService.generateNotification(data);
						}
					}else{
						document.getElementById('notifi_count')['style']['display']='none';
						document.getElementById('notifi_color')['style']['display']='none';
					}
				}
				this.getNotificationEmployee();
			  }, error => {
				  //this.router.navigate(['/auth/employer/login']);
				  
			  }
			)
			
			
		},5000);
		
  }

getCommonData(){
	let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    requestParams.search = '';
    this.sharedApiService.onGetCountry(requestParams);
    this.sharedApiService.onGetLanguage(requestParams);
}
  onGetEmployerProfile() {
    this.employerService.profile().subscribe(
      response => {
        this.employerProfileInfo = response;
        if(this.employerProfileInfo && this.employerProfileInfo.details) {
          this.employerProfileInfo.details = {...this.employerProfileInfo.details, meta: this.employerProfileInfo.meta};
          this.employerSharedService.saveEmployerProfileDetails(this.employerProfileInfo.details);
        }

      }, error => {
      }
    )
  }

  validateCall = 0;
  onGetUserProfile() {
    this.userService.profile().subscribe(
      response => {
        this.userProfileInfo = response;
		//console.log(this.userProfileInfo['details']['privacy_protection'])
        if(this.userProfileInfo && this.userProfileInfo.details) {
          this.userProfileInfo.details = {...this.userProfileInfo.details, meta: this.userProfileInfo.meta};
          this.userSharedService.saveUserProfileDetails(this.userProfileInfo.details);
            if(this.userProfileInfo && this.userProfileInfo.details.profile_completed == false && this.validateCall == 0) {
              this.router.navigate(['/user/create-candidate']);
            this.validateCall++;
          }
        }

      }, error => {
      }
    )
  }


	
}
