import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  Router,
  NavigationStart,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  NavigationEnd,
  NavigationCancel,
} from '@angular/router';
import KTLayoutHeader from '../../../../../assets/js/layout/base/header';
import KTLayoutHeaderMenu from '../../../../../assets/js/layout/base/header-menu';
import { KTUtil } from '../../../../../assets/js/components/util';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from '@modules/auth/_services/auth.service';
import { AccountService } from '@data/service/account.service';
import { EmployerService } from '@data/service/employer.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { environment as env } from '@env';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  headerContainerCSSClasses: string;
  headerMenuSelfDisplay: boolean;
  headerMenuSelfStatic: boolean;
  asideSelfDisplay: boolean;
  headerLogo: string;
  headerSelfTheme: string;
  headerMenuCSSClasses: string;
  headerMenuHTMLAttributes: any = {};
  routerLoaderTimout: any;
  public companyProfileInfo: any;
	public randomNum: number;

  @ViewChild('ktHeaderMenu', { static: true }) ktHeaderMenu: ElementRef;
  loader$: Observable<number>;

  private loaderSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  public adminprofilepath:any;
  constructor(
    private accountService: AccountService,
		private employerService: EmployerService,
		private ref: ChangeDetectorRef,
		private employerSharedService: EmployerSharedService, private authService: AuthService, private router: Router) {
    this.loader$ = this.loaderSubject;
	this.onGetProfileInfo();
		this.randomNum = Math.random();
    // page progress bar percentage
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // set page progress bar loading to start on NavigationStart event router
        this.loaderSubject.next(10);
      }
      if (event instanceof RouteConfigLoadStart) {
        this.loaderSubject.next(65);
      }
      if (event instanceof RouteConfigLoadEnd) {
        this.loaderSubject.next(90);
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        // set page progress bar loading to end on NavigationEnd event router
        this.loaderSubject.next(100);
        if (this.routerLoaderTimout) {
          clearTimeout(this.routerLoaderTimout);
        }
        this.routerLoaderTimout = setTimeout(() => {
          this.loaderSubject.next(0);
        }, 300);
      }
    });
    this.unsubscribe.push(routerSubscription);
		
  }

	
  ngOnInit(): void {
	this.employerSharedService.getEmployerProfileDetails().subscribe(
		(response: any) => {
			this.onGetProfileInfo();
			this.ref.detectChanges();
		}, error => {
			this.onGetProfileInfo();
			this.ref.detectChanges();
		}
	)
    
  }

  private getLogoURL(): string {
    let result = 'logo.png';

    // if (this.headerSelfTheme && this.headerSelfTheme === 'light') {
    //   result = 'logo-dark.png';
    // }

    // if (this.headerSelfTheme && this.headerSelfTheme === 'dark') {
    //   result = 'logo-dark.png';
    // }

    return `./assets/media/logos/${result}`;
  }

  ngAfterViewInit(): void {
    if (this.ktHeaderMenu) {
      for (const key in this.headerMenuHTMLAttributes) {
        if (this.headerMenuHTMLAttributes.hasOwnProperty(key)) {
          this.ktHeaderMenu.nativeElement.attributes[
            key
          ] = this.headerMenuHTMLAttributes[key];
        }
      }
    }

    KTUtil.ready(() => {
      // Init Desktop & Mobile Headers
      KTLayoutHeader.init('kt_header', 'kt_header_mobile');
      // Init Header Menu
      KTLayoutHeaderMenu.init('kt_header_menu', 'kt_header_menu_wrapper');
    });
  }
  
  changeDashBoard(){
	  var idName =document.getElementById('kt_body').className;
	  if(idName){
		  if(idName.indexOf('sidebar-icon-only') !=-1){
			  var z:HTMLElement=document.getElementById('kt_body');
			  z.className = 'page-loaded ';
			  var x:HTMLElement=document.getElementById('emppage');
			  x.className = 'main-panel tablescreens';
			  
		  }else{  
			  var c:HTMLElement=document.getElementById('kt_body');
			  c.className = 'page-loaded sidebar-icon-only';
			  var a:HTMLElement=document.getElementById('emppage');
			  a.className = 'main-panel';
		  }
	  }
  }

  logout() {
    //this.authService.logout();
	//localStorage.clear();
   // document.location.reload();
   this.accountService.logout();
        this.authService.logout();
		localStorage.clear();
      
  }
  
		
	/**
	**	To get the profile information
	**/
	
	onGetProfileInfo() {
		let requestParams: any = {};
		this.employerService.getCompanyProfileInfo(requestParams).subscribe(
			(response: any) => {
				this.adminprofilepath = `${env.apiPath}/images/admin/${response.details.photo}`;
				this.ref.detectChanges();
				this.companyProfileInfo = { ...response.details };
				this.companyProfileInfo['meta'] = response.meta;
				this.ref.detectChanges();
			}, error => {
				this.companyProfileInfo = {};
			}
		)
	}
	
	updateUrl = (event) => {
		console.log(event);
	}
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    if (this.routerLoaderTimout) {
      clearTimeout(this.routerLoaderTimout);
    }
  }
}
