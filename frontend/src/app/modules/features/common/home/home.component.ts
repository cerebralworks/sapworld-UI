import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoggedIn } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { SharedService } from '@shared/service/shared.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { fromEvent, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  public isFindSearch: any = 0;
  public filteredJobs: any;
  public loggedUserInfo: LoggedIn;
  public currentEmployerDetails: any;
  public currentUserDetails: any;
  public location: string = "";
  public jobTtileORModule: string = "";
  public searchForm: FormGroup;

  @ViewChild('searchJob', { static: false }) searchJobs: ElementRef;


  constructor(
    private router: Router,
    private employerService: EmployerService,
    private sharedService: SharedService,
    private employerSharedService: EmployerSharedService,
    private userSharedService: UserSharedService,
    private accountService: AccountService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.onCreateForm();
    this.accountService
    .isCurrentUser()
    .subscribe(response => {
      this.loggedUserInfo = response;
      if(this.loggedUserInfo.isLoggedIn && this.loggedUserInfo.role.includes(0)) {
        this.isFindSearch = 0;
      }else if(this.loggedUserInfo.isLoggedIn && this.loggedUserInfo.role.includes(1)) {
        this.isFindSearch = 1;
      }
    });
  }

  onCreateForm = () => {
    this.searchForm = this.formBuilder.group({
      title : new FormControl(''),
      location : new FormControl('')
    }, { validator: atLeastOne(Validators.required, ['title','location']) });
  }

  atLeastOnePhoneRequired(group : FormGroup) : {[s:string ]: boolean} {
    if (group) {
      // console.log(group);

      if(group.controls['title'].value || group.controls['location'].value) {
        return null;
      }
    }
    return {'error': true};
  }

  get f() {
    return this.searchForm.controls;
  }

  ngAfterViewInit(): void {
    this.onTitleSearch();
  }

  onTitleSearch = () => {
    if(this.searchJobs && this.searchJobs.nativeElement) {
      fromEvent(this.searchJobs.nativeElement, 'keyup').pipe(
        map((event: any) => {
          return event.target.value;
        })
        // if character length greater then 2
        , filter(res => res.length > 2 || res.length == 0)
        // Time in milliseconds between key events
        , debounceTime(600)
        // If previous query is diffent from current
        , distinctUntilChanged()
        // subscription for response
      ).subscribe((text: string) => {
        this.onGetJobBySearch(text);
      });
    }

  }

  onGetJobBySearch = (query) => {
    let requestParams: any = {};
    requestParams.alphabet = query;
    this.employerService.getPostedJob(requestParams).subscribe(
      (val: any) => {
        if (val) {
          this.filteredJobs = val.value;
        }
      },
      (error) => {
        this.filteredJobs = [];
      }
    )
  }


  handleAddressChange = (event) => {
    const address = this.sharedService.fromGooglePlace(event);
    if(address && address.city) {
      this.location = address.city.toLowerCase();
    }else if(address && address.state) {
      this.location = address.state.toLowerCase();
    }

  };

  onRedirect = () => {
    if(this.searchForm.valid) {
      if(this.isFindSearch == 0) {
        this.router.navigate(['/find-jobs'], {queryParams: {alphabet: this.searchJobs.nativeElement.value,city: this.location,}});
      }else {
        this.router.navigate(['/find-candidates']);
      }
    }
  }

}

export const atLeastOne = (validator: ValidatorFn, controls:string[] = null) => (
  group: FormGroup,
): ValidationErrors | null => {
  if(!controls){
    controls = Object.keys(group.controls)
  }

  const hasAtLeastOne = group && group.controls && controls
    .some(k => !validator(group.controls[k]));
  return hasAtLeastOne ? null : {
    atLeastOne: true,
  };
};
