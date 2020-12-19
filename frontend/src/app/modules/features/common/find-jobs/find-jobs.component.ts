import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerService } from '@data/service/employer.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

import queryString from "query-string";

@Component({
  selector: 'app-find-jobs',
  templateUrl: './find-jobs.component.html',
  styleUrls: ['./find-jobs.component.css']
})
export class FindJobsComponent implements OnInit {

  public page: number = 1;
  public limit: number = 1000;
  public postedJobs: any[] = [];
  public postedJobMeta: any;
  public sortByValue: string = 'created_at.desc';
  public experienceFilter: { value: {min: number, max: number}; text: string; }[];
  public queryParams: any = {};

  constructor(
    private employerService: EmployerService,
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private utilsHelperService: UtilsHelperService
  ) {
    this.route.queryParams.subscribe(params => {
      if(params && !this.utilsHelperService.isEmptyObj(params)) {
        this.queryParams = { ...params };
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

    // this.onGetPostedJob();
  }

  onGetPostedJob() {
    let requestParams: any = {...this.queryParams};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
    requestParams.expand = 'company';
    this.employerService.getPostedJob(requestParams).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
          this.postedJobs = [...response.items];
        }
        this.postedJobMeta = { ...response.meta };
      }, error => {
      }
    )
  }

  onSortBy = (value) => {
    if(value != 'undefined') {
      this.onRedirectRouteWithQuery({sort: value})
    }
  }

  onRedirectRouteWithQuery = (params: {}) => {
    this.queryParams = { ...this.queryParams, ...params };
    this.router.navigate([], {
      queryParams: {
        ...this.queryParams
      },
      queryParamsHandling: 'merge',
    });
  }

}
