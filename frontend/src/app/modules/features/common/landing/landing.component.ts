import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoggedIn } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { CacheService } from '@shared/service/cache.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { concat, fromEvent, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
// import { concat, Observable, of, Subject, throwError } from 'rxjs';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent extends CacheService implements OnInit {

  public isFindSearch: any = 0;
  public filteredJobs: any;
  public loggedUserInfo: LoggedIn;
  public currentEmployerDetails: any;
  public currentUserDetails: any;
  public location: string = "";
  public jobTtileORModule: string = "";
  public searchForm: FormGroup;

  @ViewChild('searchJob', { static: false }) searchJobs: ElementRef;
  public filteredValues: any[] = [];
 
  public selectedSkillItem: any;
  public isMenuOpen: boolean = false

  public movies$: Observable<any>;
  public moviesLoading = false;
  public moviesInput$ = new Subject<string>();
  public selectedMovie: any;
  public minLengthTerm = 2;

  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    nav:false,
    margin:20,
    autoplay:true,
    autoplayTimeout:2000,
    autoplayHoverPause:true,
    responsive:{
      0:{
        items:3
      },
      600:{
        items:4
      },
      1000:{
        items:6
      }
    }
  }

  constructor(
    private router: Router,
    private employerService: EmployerService,
    private sharedService: SharedService,
    private employerSharedService: EmployerSharedService,
    private userSharedService: UserSharedService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public utilsHelperService: UtilsHelperService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

	/**
   * To initialize the page
   */
	ngOnInit(): void {
		
	}
	
	
 

  
 onRedirectUrl = (url: string) => {
    this.router.navigate([url])
  }
  
};
