import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { fromEvent, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

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
  filteredValues: any[] = [];
  selectedSkillItem: any;


  constructor(
    private router: Router,
    private employerService: EmployerService,
    private sharedService: SharedService,
    private employerSharedService: EmployerSharedService,
    private userSharedService: UserSharedService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.onCreateForm();
    this.accountService
      .isCurrentUser()
      .subscribe(response => {
        this.loggedUserInfo = response;
        if (this.loggedUserInfo.isLoggedIn && this.loggedUserInfo.role.includes(0)) {
          this.isFindSearch = 0;
        } else if (this.loggedUserInfo.isLoggedIn && this.loggedUserInfo.role.includes(1)) {
          this.isFindSearch = 1;
        }
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
      // console.log(group);

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
    this.onTitleSearch();
  }

  onTitleSearch = () => {
    if (this.searchJobs && this.searchJobs.nativeElement) {
      fromEvent(this.searchJobs.nativeElement, 'keyup').pipe(
        map((event: any) => {
          return event.target.value;
        })
        // if character length greater then 2
        , filter(res => res.length > 1 || res.length == 0)
        // Time in milliseconds between key events
        , debounceTime(600)
        // If previous query is diffent from current
        , distinctUntilChanged()
        // subscription for response
      ).subscribe((text: string) => {
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
        search: item.tag ? item.tag.toLowerCase() : this.searchForm.value.search.toLowerCase(),
        skillId: item.id ? item.id : ''
      });
    }else {
      this.searchForm.patchValue({
        search: item.tag ? item.tag.toLowerCase() : this.searchForm.value.search.toLowerCase()
      });
    }

    this.filteredValues = []
  }

  // onGetCandidateList(query) {
  //   this.filteredValues = [];
  //   let requestParams: any = {};
  //   requestParams.page = 1;
  //   requestParams.limit = 1000;
  //   requestParams.status = 1;
  //   requestParams.skill_tags = query;

  //   this.userService.getUsers(requestParams).subscribe(
  //     response => {
  //       if(response && response.items && response.items.length > 0) {
  //         this.filteredValues = [...response.items];
  //       }
  //       this.filteredValues = { ...response.meta };
  //     }, error => {
  //     }
  //   )
  // }


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
      if (this.isFindSearch == 0) {
        this.router.navigate(['/find-jobs'],
          {
            queryParams:
            {
              search: this.searchForm.value.search,
              city: (this.searchForm.value && this.searchForm.value.location) ? this.searchForm.value.location : ''
            }
          });
      } else {
        this.router.navigate(['/find-candidates'],
          {
            queryParams:
            {
              skill_tags: this.searchForm.value.skillId,
              city: (this.searchForm.value && this.searchForm.value.location) ? this.searchForm.value.location : ''
            }
          });
      }
    }
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
