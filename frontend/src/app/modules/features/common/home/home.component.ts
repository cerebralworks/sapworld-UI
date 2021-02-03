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
import { concat, fromEvent, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
// import { concat, Observable, of, Subject, throwError } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CacheService implements OnInit, AfterViewInit {

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

  movies$: Observable<any>;
  moviesLoading = false;
  moviesInput$ = new Subject<string>();
  selectedMovie: any;
  minLengthTerm = 2;

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

  onCheck = (event) => {
console.log(event);

  }

  ngOnInit(): void {
    this.onCreateForm();
    this.accountService
      .isCurrentUser()
      .subscribe(response => {
        this.loggedUserInfo = response;
      });
  }

  onCreateForm = () => {
    this.searchForm = this.formBuilder.group({
      search: new FormControl(''),
      location: new FormControl(''),
      skillId: new FormControl('')
    }, { validator: atLeastOne(Validators.required, ['search', 'location']) });
  }

  atLeastOnePhoneRequired(group: FormGroup): { [s: string]: boolean } {
    if (group) {
      if (group.controls['search'].value || group.controls['location'].value) {
        return null;
      }
    }
    return { 'error': true };
  }

  get f() {
    return this.searchForm.controls;
  }

  ngAfterViewInit(): void {
    // this.onTitleSearch();
    this.loadMovies();
    this.changeDetectorRef.detectChanges();
  }

  loadMovies() {

    this.movies$ = concat(
      of([]), // default items
      this.moviesInput$.pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(800),
        switchMap(term => {

          return this.getMovies(term).pipe(
            catchError(() => of([])), // empty list on error
          )
        })
      )
    );

  }

  trackByFn(item: any) {
    return item.id;
  }

  getMovies(term: string = null): Observable<any> {
    this.filteredValues = [];
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    requestParams.status = 1;
    requestParams.search = term;
    return this.employerService.getSkill(requestParams).pipe(
      map((response) => {
          if (response && response.items && response.items.length > 0) {
           return [...response.items];
          }
        }, error => {
        }
      )
    )
    // onGetSkillTag
    // return this.http
    //   .get<any>('http://www.omdbapi.com/?apikey=[YOUR_OMDB_KEY]&s=' + term)
    //   .pipe(map(resp => {
    //     if (resp.Error) {
    //       throwError(resp.Error);
    //     } else {
    //       return resp.Search;
    //     }
    //   })
    //   );
  }


  onTitleSearch = () => {
    if (this.searchJobs && this.searchJobs.nativeElement) {
      fromEvent(this.searchJobs.nativeElement, 'keyup').pipe(
        map((event: any) => {
          return event.target.value;
        })
        // if character length greater then 2
        , filter(res => res.length > 1)
        // Time in milliseconds between key events
        , debounceTime(600)
        // If previous query is diffent from current
        , distinctUntilChanged()
        // subscription for response
      ).subscribe((text: string) => {
        // if (this.loggedUserInfo.isLoggedIn && this.loggedUserInfo.role.includes(1)) {
        //   this.onGetSkillTag(text);
        // } else {
        //   this.onGetJobBySearch(text)
        // }
        this.onGetSkillTag(text);
      });
    }

  }

  onGetJobBySearch = (query) => {
    this.filteredValues = [];
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    requestParams.search = query;
    this.employerService.getPostedJob(requestParams).subscribe(
      (response: any) => {
        if (response && response.items && response.items.length > 0) {
          this.filteredValues = [...response.items];
        }
      },
      (error) => {
        this.filteredValues = [];
      }
    )
  }

  onGetSkillTag(query) {
    this.filteredValues = [];
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    requestParams.status = 1;
    requestParams.search = query;

    this.employerService.getSkill(requestParams).subscribe(
      response => {
        if (response && response.items && response.items.length > 0) {
          this.filteredValues = [...response.items];
        }
      }, error => {
      }
    )
  }

  onSelectSkill = (item) => {
    this.selectedSkillItem = item;
    if(this.loggedUserInfo.isLoggedIn && this.loggedUserInfo.role.includes(1)) {
      this.setItem('homeSelectedSkill', item);
      this.searchForm.patchValue({
        search: item.tag ? item.tag.toString() : this.searchForm.value.search.toString(),
        skillId: item.id ? item.id.toString() : ''
      });
    }else {
      this.searchForm.patchValue({
        search: item.title ? item.title.toLowerCase() : this.searchForm.value.search.toLowerCase()
      });
    }
    this.filteredValues = []
  }


  handleAddressChange = (event) => {
    const address = this.sharedService.fromGooglePlace(event);
    if (address && address.city) {
      this.location = address.city.toLowerCase();
    } else if (address && address.state) {
      this.location = address.state.toLowerCase();
    }
  };

  onRedirect = () => {
    if (this.searchForm.valid) {
      if(this.loggedUserInfo.isLoggedIn && this.loggedUserInfo.role.includes(1)) {
        this.setItem('homeSelectedSkill', this.onReturnIDFronArray(this.searchForm.value.search, 'tag', true));
        this.router.navigate(['/find-candidates'],
          {
            queryParams:
            {
              skill_tags: this.onReturnIDFronArray(this.searchForm.value.search, 'id'),
              city: (this.searchForm.value && this.searchForm.value.location) ? this.searchForm.value.location : ''
            }
          });

      } else {
        this.setItem('homeSelectedSkill', this.onReturnIDFronArray(this.searchForm.value.search, 'tag', true));
        this.router.navigate(['/find-jobs'],
          {
            queryParams:
            {
              skills: this.onReturnIDFronArray(this.searchForm.value.search, 'id'),
              city: (this.searchForm.value && this.searchForm.value.location) ? this.searchForm.value.location : ''
            }
          });
      }
    }
  }

  onReturnIDFronArray = (arrayOfObj: any [] =[], field: string, isString: boolean = false) => {
    if(Array.isArray(arrayOfObj) && arrayOfObj.length) {
      return arrayOfObj.map((val) => {
        return isString ? val[field] ? this.utilsHelperService.onSplitTag(val[field]) : '': val[field] ? val[field] : '';
      }).toString();
    }
    return "";
  }

}

export const atLeastOne = (validator: ValidatorFn, controls: string[] = null) => (
  group: FormGroup,
): ValidationErrors | null => {
  if (!controls) {
    controls = Object.keys(group.controls)
  }

  const hasAtLeastOne = group && group.controls && controls
    .some(k => !validator(group.controls[k]));
  return hasAtLeastOne ? null : {
    atLeastOne: true,
  };
};
