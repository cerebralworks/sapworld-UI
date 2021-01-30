import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-employer-shortlisted-candidate',
  templateUrl: './employer-shortlisted-candidate.component.html',
  styleUrls: ['./employer-shortlisted-candidate.component.css']
})
export class EmployerShortlistedCandidateComponent implements OnInit {

  public shortListedJobs: any[] = [];
  public shortListedMeta: any;
  public page: number = 1;
  public limit: number = 25;
  public selectedJob: any;
  public queryParams: any;
  public postedJobMeta: any;
  public postedJobs: any[] = [];
  public validateSubscribe: number = 0;

  constructor(
    private employerService: EmployerService,
    public utilsHelperService: UtilsHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private employerSharedService: EmployerSharedService
  ) {
    this.route.queryParams.subscribe(params => {
      if(params && !this.utilsHelperService.isEmptyObj(params)) {
        let urlQueryParams = {...params};
        if(urlQueryParams && urlQueryParams.id) {
          this.selectedJob = {id: urlQueryParams.id};
        }

        this.queryParams = {...this.queryParams, ...urlQueryParams };

      }
    });
  }

  ngOnInit(): void {

    this.employerSharedService.getEmployerProfileDetails().subscribe(
      details => {
        if(details) {
          if((details && details.id) && this.validateSubscribe == 0) {
            this.onGetPostedJob(details.id);
            this.validateSubscribe ++;
          }
        }
      }
    )
  }

  onSetJob = (item) =>{
    this.selectedJob = item;
    if(this.selectedJob && this.selectedJob.id) {
      this.shortListedJobs = [];
      const removeEmpty = this.utilsHelperService.clean(this.queryParams);
      let url = this.router.createUrlTree(['/employer/dashboard'], {queryParams: {...removeEmpty, id: this.selectedJob.id}, relativeTo: this.route}).toString();
      this.location.go(url);
      this.onGetShortListedJobs();
    }
  }

  onGetPostedJob(companyId) {
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    requestParams.expand = 'company';
    requestParams.company = companyId;
    requestParams.sort = 'created_at.desc';
    this.employerService.getPostedJob(requestParams).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
          this.postedJobs = [...response.items];
          if(this.postedJobs && this.postedJobs.length && this.postedJobs[0]) {
            if(this.selectedJob && this.selectedJob.id) {
              const filterJob = this.postedJobs.find((val) => {
                if(this.selectedJob && this.selectedJob.id)
                return parseInt(val.id) == parseInt(this.selectedJob.id);
              });
              if(filterJob && !this.utilsHelperService.isEmptyObj(filterJob)) {
                this.selectedJob = filterJob;
              }
              this.onGetShortListedJobs();
            }else {
              this.selectedJob = this.postedJobs[0];
              this.onGetShortListedJobs();
            }

          }

        }
        this.postedJobMeta = { ...response.meta };
      }, error => {
      }
    )
  }

  onGetShortListedJobs = () => {
      let requestParams: any = {};
      requestParams.page = this.page;
      requestParams.limit = this.limit;
      requestParams.expand = "job_posting,user,employer";
      requestParams.job_posting = this.selectedJob.id;
      requestParams.short_listed = 1;
      this.employerService.applicationsList(requestParams).subscribe(
        response => {
          if(response && response.items && response.items.length > 0) {
            this.shortListedJobs = [...this.shortListedJobs, ...response.items];
          }
          this.shortListedMeta = { ...response.meta }
        }, error => {
        }
      )
  }

  onLoadMoreJob = () => {
    this.page = this.page + 1;
    this.onGetShortListedJobs();
  }
}
