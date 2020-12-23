import { LabelType, Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { UserService } from '@data/service/user.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-find-candidates',
  templateUrl: './find-candidates.component.html',
  styleUrls: ['./find-candidates.component.css']
})
export class FindCandidatesComponent implements OnInit {

  public page: number = 1;
  public limit: number = 1000;
  public userList: any[];
  public userMeta: any;
  public sortByValue: string = 'created_at.desc';
  public experienceFilter: { value: {min: number, max: number}; text: string; }[];
  public queryParams: any = { type: []};

  public minValue: number = 100;
  public maxValue: number = 400;
  public options: Options = {
    floor: 0,
    ceil: 500,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min price:</b> $" + value;
        case LabelType.High:
          return "<b>Max price:</b> $" + value;
        default:
          return "$" + value;
      }
    }
  };
  public skillItems: any = {};

  constructor(
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    public utilsHelperService: UtilsHelperService,
    private dataService: DataService,
    private userService: UserService
  ) {
    this.route.queryParams.subscribe(params => {
      if(params && !this.utilsHelperService.isEmptyObj(params)) {
        let urlQueryParams = {...params};
        const myArray = this.route.snapshot.queryParamMap.get('type');
        if (myArray === null) {
          urlQueryParams.type = new Array<string>();
        } else {
          urlQueryParams.type = JSON.parse(myArray);
        }
        this.queryParams = { ...urlQueryParams };
      }
    });
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.experienceFilter = [
      {value: {min: 0, max: 1}, text: 'Freshers'},
      {value: {min: 1, max: 3}, text: '1 - 3 Years'},
      {value: {min: 3, max: 5}, text: '3 - 5 Years'},
      {value: {min: 5, max: 7}, text: '5 - 7 Years'},
      {value: {min: 7, max: 10}, text: '7 - 10 Years'},
      {value: {min: 10, max: 20}, text: '10 Years & above'}
    ]

    this.dataService.getSkillDataSource().subscribe(
      response => {
        this.skillItems = response
      }
    );

    this.onGetCandidateList();

  }

  onGetCandidateList() {
    let requestParams: any = {...this.queryParams};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
    requestParams.status = 1;

    this.userService.getUsers(requestParams).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
          this.userList = [...response.items];
        }
        this.userMeta = { ...response.meta };
      }, error => {
      }
    )
  }

  onFilterByValues = (fieldName, value, type: string = 'string') => {
    if(value != 'undefined' && type == 'string') {
      this.onRedirectRouteWithQuery({[fieldName]: value})
    } else if(value != 'undefined' && type == 'array') {
      let index = this.queryParams.type.indexOf(value);
      if(index > -1) {
        this.queryParams.type.splice(index, 1)
      }else {
        this.queryParams.type.push(value)
      }
      this.onRedirectRouteWithQuery({[fieldName]: this.queryParams.type})

    }
  }

  onRedirectRouteWithQuery = (params: any = {}) => {
    params.type = JSON.stringify(params.type);
    this.queryParams = { ...this.queryParams, ...params };
    const navigationExtras: NavigationExtras = {
      queryParams: {...this.queryParams},
      queryParamsHandling: 'merge'
    };

    this.router.navigate([], navigationExtras);
  }

}
